using System.Net.Http;
using System.Threading.Tasks;
using System;
using System.Net;
using TooGoodToGo.Api;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace TooGoodToGoNotifier.Proxy
{
    public class ApiRequester
    {
        private readonly ProxyManager _proxyManager;
        private readonly CookieContainer _cookieContainer;
        private readonly ILogger<ApiRequester> _logger;

        public ApiRequester(ProxyManager proxyManager, CookieContainer cookieContainer, ILogger<ApiRequester> logger)
        {
            _proxyManager = proxyManager;
            _cookieContainer = cookieContainer;
            _logger = logger;
        }

        public async Task<string> RequestAndThrowIfNotSuccessfulAsync(HttpRequestMessage httpRequestMessage)
        {
            const string TGTG_APK_VERSION = "22.5.5"; //TODO: scrape version from: https://play.google.com/store/apps/details?id=com.app.tgtg&hl=en&gl=US
            var userAgents = new List<string>()
            {
                $"TGTG/{TGTG_APK_VERSION} Dalvik/2.1.0 (Linux; U; Android 9; Nexus 5 Build/M4B30Z)",
                $"TGTG/{TGTG_APK_VERSION} Dalvik/2.1.0 (Linux; U; Android 10; SM-G935F Build/NRD90M)",
                $"TGTG/{TGTG_APK_VERSION} Dalvik/2.1.0 (Linux; Android 12; SM-G920V Build/MMB29K)",
                $"TGTG/{TGTG_APK_VERSION} Dalvik/2.1.0 (Linux; U; Android 11; sdk_gphone_x86_arm Build/RSR1.201013.001)"
            };

            var proxy = _proxyManager.GetNextProxy();
            using (var httpClient = CreateHttpClient(proxy))
            {
                httpClient.Timeout = System.Threading.Timeout.InfiniteTimeSpan;
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
                httpClient.DefaultRequestHeaders.Add("User-Agent", userAgents[new Random().Next(userAgents.Count)]);

                //try
                //{
                    var response = await httpClient.SendAsync(httpRequestMessage);

                    var httpResponseContent = await response.Content.ReadAsStringAsync();

                    if (!response.IsSuccessStatusCode)
                    {
                        throw new TooGoodToGoRequestException("Error while requesting TooGoodToGo's services", response.StatusCode, httpResponseContent);
                    }

                    return httpResponseContent;
                //}
                //catch (Exception ex)
                //{
                //    _logger.LogError($"Error while requesting TooGoodToGo's services. Exception: {ex.Message}");
                //    return await Task.FromResult("");
                //}
            }
        }

        public HttpClient CreateHttpClient(WebProxy proxy)
        {
            var handler = new HttpClientHandler
            {
                Proxy = proxy,
                UseProxy = false,
                UseCookies = true,
                CookieContainer = _cookieContainer,
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };

            return new HttpClient(handler, disposeHandler: true);
        }
    }
}
