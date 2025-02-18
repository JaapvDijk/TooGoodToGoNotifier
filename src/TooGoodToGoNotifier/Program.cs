﻿using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using Coravel;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using NLog;
using NLog.Extensions.Logging;
using Polly;
using Polly.Extensions.Http;
using Polly.Timeout;
using TooGoodToGo.Api.Interfaces;
using TooGoodToGo.Api.Services;
using TooGoodToGoNotifier.Core.Options;
using TooGoodToGoNotifier.Entities;
using TooGoodToGoNotifier.Interfaces;
using TooGoodToGoNotifier.Jobs;
using TooGoodToGoNotifier.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TooGoodToGoNotifier.Helpers;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Http;
using TooGoodToGoNotifier.Proxy;

namespace TooGoodToGoNotifier
{
    public class Program
    {
        private static async Task Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

            ConfigureServices(builder);

            WebApplication app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();
            app.UseAuthentication();
            app.MapControllers();
            await app.AuthenticateToTooGoodToGoServices();
            app.ScheduleBackgroundJobs(); // Coravel jobs must be scheduled at startup, otherwise RunOnceAtStart() method won't work
            app.UseCors(x => x.WithOrigins("http://localhost:3000") //TODO: take url from settings, development and production url
               .AllowAnyMethod()
               .AllowAnyHeader());

            await app.Services.GetRequiredService<FindTheLimit>().Start();

            app.Run();
        }

        private static void ConfigureServices(WebApplicationBuilder builder)
        {
            IServiceCollection services = builder.Services;
            ConfigurationManager configuration = builder.Configuration;
            var cookieContainer = new CookieContainer();

            LogManager.Setup()
            .LoadConfigurationFromSection(configuration);
                
            builder.Logging.ClearProviders()
            .AddNLog();

            services.AddControllers();

            services.AddAuthentication()
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtSecret"])), //from secret store
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddLogging()
            .AddEndpointsApiExplorer()
            .AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "TooGoodToGoNotifier Api",
                    Description = "Api for managing notifications about your favorite baskets in the TooGoodToGo application"
                });

                string xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            })
            .AddDbContext<TooGoodToGoNotifierDbContext>(options =>
            {
                options.UseSqlite(configuration.GetConnectionString("TooGoodToGoNotifier"));
            })
            .AddScheduler()
            .AddMemoryCache()
            .Configure<NotifierOptions>(configuration.GetSection(nameof(NotifierOptions)))
            .Configure<TooGoodToGoApiOptions>(configuration.GetSection(nameof(TooGoodToGoApiOptions)))
            .Configure<EmailServiceOptions>(configuration.GetSection(nameof(EmailServiceOptions)))
            .AddTransient<ITooGoodToGoService, TooGoodToGoService>()
            .AddTransient<IEmailService, EmailService>()
            .AddTransient<IBasketService, BasketService>()
            .AddTransient<IUserService, UserService>()
            .AddTransient<FavoriteBasketsWatcherJob>()
            .AddTransient<RefreshAccessTokenJob>()
            .AddTransient<SynchronizeFavoriteBasketsJob>()
            .AddSingleton<Context>()
            .AddSingleton(cookieContainer)
            .AddSingleton<ProxyManager>()
            .AddSingleton<ApiRequester>()
            .AddSingleton<FindTheLimit>();

            services.AddHttpClient<ITooGoodToGoService, TooGoodToGoService>(httpClient =>
            {
                httpClient.Timeout = System.Threading.Timeout.InfiniteTimeSpan;
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
                httpClient.DefaultRequestHeaders.Add("User-Agent", "TGTG/22.2.3 Dalvik/2.1.0 (Linux; U; Android 11; sdk_gphone_x86_arm Build/RSR1.201013.001)");
            })
            .ConfigurePrimaryHttpMessageHandler(() =>
            {
                return new HttpClientHandler
                {
                    UseCookies = true,
                    CookieContainer = cookieContainer
                };
            })
            .AddPolicyHandler(GetWaitAndRetryForeverPolicy)
            .AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(10));

            services.RemoveAll<IHttpMessageHandlerBuilderFilter>(); // Removes all httpclient logging
        }

        private static IAsyncPolicy<HttpResponseMessage> GetWaitAndRetryForeverPolicy(IServiceProvider serviceProvider, HttpRequestMessage httpRequestMessage)
        {
            return HttpPolicyExtensions.HandleTransientHttpError()
                .OrInner<TimeoutRejectedException>()
                .OrResult(httpResponseMessage => httpResponseMessage.StatusCode == HttpStatusCode.TooManyRequests)
                .WaitAndRetryForeverAsync(retryAttempt => TimeSpan.FromSeconds(30 * retryAttempt), (resp, retryAttempt, timespan) =>
                {
                    serviceProvider.GetService<ILogger<TooGoodToGoService>>().LogInformation($"Transient Http, timeout or too many attempts error occured: delaying for {timespan.TotalSeconds} seconds, then making retry n°{retryAttempt}, ex: {resp.Exception?.Message}, status: {resp.Result.StatusCode}");
                });
        }
    }
}
