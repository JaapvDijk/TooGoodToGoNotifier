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
                //"156.236.31.44:1580", //closed
                //"185.217.136.67:1337",
                //"31.186.241.8:8888",
                //"188.166.56.246:80", //NOPE
                //"23.137.248.197:8888",
                //"91.92.244.233:80", //closed
                "31.186.241.8:8888", //WORKS!
                //"85.209.153.173:4145", //SSL error
                //"85.209.153.175:8888", //SSL error
                //"195.12.191.2:80",
                //"13.80.134.180:80",
                //"93.117.225.195:80",
                //"206.189.108.248:8081"
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
