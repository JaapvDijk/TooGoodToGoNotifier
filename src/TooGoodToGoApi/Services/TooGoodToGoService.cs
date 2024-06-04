using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using TooGoodToGo.Api.Interfaces;
using TooGoodToGo.Api.Models;
using TooGoodToGo.Api.Models.Requests;
using TooGoodToGo.Api.Models.Responses;
using TooGoodToGoNotifier.Core;
using TooGoodToGoNotifier.Core.Options;
using TooGoodToGoNotifier.Proxy;

namespace TooGoodToGo.Api.Services
{
    public class TooGoodToGoService : ITooGoodToGoService
    {
        private readonly ILogger _logger;
        private readonly TooGoodToGoApiOptions _apiOptions;
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerSettings _jsonSerializerSettings;
        private readonly IMemoryCache _memoryCache;
        private readonly ApiRequester _apiRequester;

        public TooGoodToGoService(ILogger<TooGoodToGoService> logger, IOptions<TooGoodToGoApiOptions> apiOptions, HttpClient httpClient, IMemoryCache memoryCache, ApiRequester apiRequester)
        {
            _logger = logger;
            _apiOptions = apiOptions.Value;
            _httpClient = httpClient;
            _memoryCache = memoryCache;
            _jsonSerializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new SnakeCaseNamingStrategy()
                }
            };

            _apiRequester = apiRequester;
        }

        public async Task<GetBasketsResponse> GetFavoriteBasketsAsync(string accessToken, int userId)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiOptions.BaseUrl}{_apiOptions.GetItemsEndpoint}");
            request.Headers.Add("Authorization", $"Bearer {accessToken}");

            // When FavoritesOnly is true, origin and radius are ignored but must still be specified.
            var getFavoriteBasketsRequest = new GetBasketsRequest
            {
                UserId = userId,
                Origin = null, //new TgtgLocation { Latitude = 0, Longitude = 0 }
                Radius = 1,
                Page = 1,
                PageSize = 400, // Max page size allowed by TooGoodToGo API
                FavoritesOnly = true,
                WithStockOnly = false
            };

            SerializeHttpRequestContentAsJson(request, getFavoriteBasketsRequest);

            GetBasketsResponse getBasketsResponse = await ExecuteAndThrowIfNotSuccessfulAsync<GetBasketsResponse>(request);

            _memoryCache.Set(Constants.BASKETS_CACHE_KEY, getBasketsResponse.Items);

            return getBasketsResponse;
        }

        public async Task<AuthenticateByEmailResponse> AuthenticateByEmailAsync()
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiOptions.BaseUrl}{_apiOptions.AuthenticateByEmailEndpoint}");

            var authenticateByEmailRequest = new AuthenticateByEmailRequest
            {
                DeviceType = "ANDROID",
                Email = _apiOptions.AccountEmail
            };

            SerializeHttpRequestContentAsJson(request, authenticateByEmailRequest);

            AuthenticateByEmailResponse authenticateByEmailResponse = await ExecuteAndThrowIfNotSuccessfulAsync<AuthenticateByEmailResponse>(request);

            return authenticateByEmailResponse;
        }

        public async Task<AuthenticateByPollingIdResponse> AuhenticateByPollingIdAsync(string pollingId)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiOptions.BaseUrl}{_apiOptions.AuthenticateByRequestPollingIdEndpoint}");

            var authenticateByPollingIdRequest = new AuthenticateByPollingIdRequest
            {
                DeviceType = "ANDROID",
                Email = _apiOptions.AccountEmail,
                RequestPollingId = pollingId
            };

            SerializeHttpRequestContentAsJson(request, authenticateByPollingIdRequest);

            AuthenticateByPollingIdResponse authenticateByPollingIdResponse = await ExecuteAndThrowIfNotSuccessfulAsync<AuthenticateByPollingIdResponse>(request);

            return authenticateByPollingIdResponse;
        }

        public async Task<RefreshTokenResponse> RefreshAccessTokenAsync(string refreshToken)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiOptions.BaseUrl}{_apiOptions.RefreshTokenEndpoint}");

            var refreshTokenRequest = new RefreshTokenRequest
            {
                RefreshToken = refreshToken
            };

            SerializeHttpRequestContentAsJson(request, refreshTokenRequest);

            RefreshTokenResponse refreshTokenResponse = await ExecuteAndThrowIfNotSuccessfulAsync<RefreshTokenResponse>(request);

            return refreshTokenResponse;
        }

        public async Task SetFavoriteAsync(string accessToken, string basketId, bool isFavorite)
        {
            //RETURNS NOT FOUND
            //var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiOptions.BaseUrl}{_apiOptions.GetItemsEndpoint}{basketId}/setFavorite");
            //request.Headers.Add("Authorization", $"Bearer {accessToken}");

            //var setBasketFavoriteStatusRequest = new SetBasketFavoriteStatusRequest
            //{
            //    IsFavorite = isFavorite
            //};

            //SerializeHttpRequestContentAsJson(request, setBasketFavoriteStatusRequest);

            //await ExecuteAndThrowIfNotSuccessfulAsync(request);
        }

        private async Task<T> ExecuteAndThrowIfNotSuccessfulAsync<T>(HttpRequestMessage httpRequestMessage)
        {
            string httpResponseContent = await _apiRequester.RequestAndThrowIfNotSuccessfulAsync(httpRequestMessage);

            return JsonConvert.DeserializeObject<T>(httpResponseContent, _jsonSerializerSettings);
        }

        private void SerializeHttpRequestContentAsJson(HttpRequestMessage httpRequestMessage, object content)
        {
            string serializedObject = JsonConvert.SerializeObject(content, _jsonSerializerSettings);
            httpRequestMessage.Content = new StringContent(serializedObject, Encoding.UTF8, "application/json");
        }
    }
}
