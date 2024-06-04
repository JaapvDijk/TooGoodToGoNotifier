using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace TooGoodToGoNotifier.Proxy
{
    public class ProxyManager //The beatifull name 'manager' not indicating what this class does at all. And you know what its gonna do, a whole bunch of proxy stuff!
    {
        private readonly List<WebProxy> _proxies = new(); //TODO: To Delegate that loads new proxies, resets proxyIndex
        private int _currentProxyIndex = 0;

        public ProxyManager()
        {
            List<string> proxyList = new()
            {
                //"31.186.241.8:8888", //WORKS!
                //"104.207.57.156:3128",
                //"104.207.62.185:3128",
                //"104.207.50.4:3128",
                //"104.207.50.200:3128",
                //"104.207.33.166:3128",
                //"104.207.33.91:3128",
                "104.207.34.48:3128",
                //"104.207.57.160:3128",
                //"localhost:5559"
            };

            _proxies.AddRange(proxyList.Select(address => new WebProxy(address)));
        }

        public WebProxy GetNextProxy()
        {
            var proxy = _proxies[_currentProxyIndex];
            _currentProxyIndex = (_currentProxyIndex + 1) % _proxies.Count;

            return proxy;
        }
    }
}
