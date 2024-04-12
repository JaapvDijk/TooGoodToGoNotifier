using System;
using System.Threading.Tasks;
using Coravel;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Polly;
using TooGoodToGo.Api.Interfaces;
using TooGoodToGo.Api.Models.Responses;
using TooGoodToGoNotifier.Core.Options;
using TooGoodToGoNotifier.Jobs;

namespace TooGoodToGoNotifier
{
    public static class WebApplicationExtensions
    {
        public static void ScheduleBackgroundJobs(this WebApplication app)
        {
            var notifierOptions = new NotifierOptions();
            app.Configuration.GetSection(nameof(NotifierOptions)).Bind(notifierOptions);

            app.Services.UseScheduler(scheduler =>
            {
                // Scheduling job to refresh access token
                scheduler.Schedule<RefreshAccessTokenJob>()
                .Cron(notifierOptions.RefreshAccessTokenCronExpression)
                .Zoned(TimeZoneInfo.Local);

                // Scheduling job to watch for available baskets
                scheduler.Schedule<FavoriteBasketsWatcherJob>()
                .EverySeconds(notifierOptions.ThrottleInterval)
                .RunOnceAtStart()
                .When(() => CurrentTimeIsBetweenConfiguredRangeAsync(notifierOptions))
                .Zoned(TimeZoneInfo.Local)
                .PreventOverlapping(nameof(FavoriteBasketsWatcherJob));

                // Scheduling jobs to synchronize users favorites baskets
                scheduler.Schedule<SynchronizeFavoriteBasketsJob>()
                .Cron(notifierOptions.SynchronizeFavoriteBasketsCronExpression)
                .RunOnceAtStart()
                .PreventOverlapping(nameof(SynchronizeFavoriteBasketsJob))
                .Zoned(TimeZoneInfo.Local);
            })
            .OnError((exception) =>
            {
                app.Logger.LogCritical(exception, "Critical error occured");
                app.StopAsync();
            });
        }

        public static async Task AuthenticateToTooGoodToGoServices(this WebApplication app)
        {
            try
            {
                app.Logger.LogInformation("Authenticating to TooGoodToGo's services");

                ITooGoodToGoService tooGoodToGoService = app.Services.GetService<ITooGoodToGoService>();
                AuthenticateByEmailResponse authenticateByEmailResponse = await tooGoodToGoService.AuthenticateByEmailAsync();

                var polling = await Policy.HandleResult<AuthenticateByPollingIdResponse>(result => result == null)
                                          .WaitAndRetryAsync(20, _ => TimeSpan.FromSeconds(15), onRetry: (_, _, retryAttempt, _) =>
                                          {
                                              app.Logger.LogInformation($"PollingId request attempt n°{retryAttempt}");
                                          })
                                          .ExecuteAndCaptureAsync(async () =>
                                          {
                                              return await tooGoodToGoService.AuhenticateByPollingIdAsync(authenticateByEmailResponse.PollingId);
                                          });

                if (polling.Outcome == OutcomeType.Failure)
                {
                    //TODO: App cant make any requests to TooGoodToGo's services, what should we do?

                    app.Logger.LogInformation($"Reached polling limit for PollingId: {authenticateByEmailResponse.PollingId}, polling has stopped");
                    
                    return;
                }

                Context context = app.Services.GetService<Context>();
                context.AccessToken = polling.Result.AccessToken;
                context.RefreshToken = polling.Result.RefreshToken;
                context.TooGoodToGoUserId = polling.Result.StartupData.User.UserId;
                
                app.Logger.LogInformation("Successfuly authenticated to TooGoodToGo's services");
            }
            catch (Exception exception)
            {
                app.Logger.LogCritical(exception, "Critical error occured");
                await app.StopAsync();
            }
        }

        private static Task<bool> CurrentTimeIsBetweenConfiguredRangeAsync(NotifierOptions notifierOptions)
        {
            TimeSpan currentTime = DateTime.Now.TimeOfDay;
            return Task.FromResult(currentTime >= notifierOptions.StartTime && currentTime <= notifierOptions.EndTime);
        }
    }
}
