﻿namespace TooGoodToGo.Api.Models.Requests
{
    public class GetBasketsRequest
    {
        public int UserId { get; set; }

        public TgtgLocation Origin { get; set; }

        public int Radius { get; set; }

        public int PageSize { get; set; }

        public int Page { get; set; }

        public bool FavoritesOnly { get; set; }

        public bool WithStockOnly { get; set; }
        public string SearchPhrase { get; set; }
    }
}
