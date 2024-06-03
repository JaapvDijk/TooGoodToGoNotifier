using Polly;
using System;
using NLog;
using TooGoodToGo.Api.Models.Responses;
using TooGoodToGo.Api.Interfaces;
using System.Threading.Tasks;
using MimeKit.Cryptography;

namespace TooGoodToGoNotifier.Helpers
{
    public class FindTheLimit
    {
        private ILogger _logger;
        private ITooGoodToGoService _tgtgService;
        private Context _context;

        public FindTheLimit(ITooGoodToGoService tgtgService, Context context)
        {
            _logger = LogManager.GetCurrentClassLogger();
            _tgtgService = tgtgService;
            _context = context;
        }

        public double GetLimit(double interval, int retryNr, int speedUpAfterTries)
        {
            var res = interval * (100 - (retryNr / speedUpAfterTries)) / 100;

            if (res < 0.5)
            {
                return 0.5;
            }

            return res;
        }

        public async Task Start()
        {
            const double retryWaitIntervalSeconds = 0.5;
            const short speedUpAfterTries = 5;

            var policy = Policy.Handle<Exception>()
                               .OrResult<GetBasketsResponse>((resp) => true)
                               .WaitAndRetryForeverAsync(retryNr => TimeSpan.FromSeconds(retryWaitIntervalSeconds), //GetLimit(retryWaitIntervalSeconds, retryNr, speedUpAfterTries)
                               onRetry: (resp, retryNr, interval) => 
                               {
                                   bool isSuccesResponse = resp.Exception != null && resp.Result != default;
                                    if (isSuccesResponse)
                                   {
                                       if (retryNr % speedUpAfterTries == 0)
                                       {
                                           _logger.Info($"[Request succes] interval, {interval}, retry count: {retryNr}, items: {resp.Result.Items}");
                                       }
                                   }
                                    else
                                    {
                                        _logger.Error($"[Requset failed] interval, {interval}, retry count: {retryNr}, ex: {resp.Exception.Message}");
                                    }
                               });

            await policy.ExecuteAsync(async () =>
            {
                var res = await _tgtgService.GetFavoriteBasketsAsync(_context.AccessToken, _context.TooGoodToGoUserId); //Throws exception

                return res;
            });
        }
    }
}
