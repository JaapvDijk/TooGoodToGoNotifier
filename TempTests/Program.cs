using System.Net;
using System.Net.Http.Json;
using System.Net.NetworkInformation;
using System.Text;
using System.Text.Json.Serialization;

Console.WriteLine("Started..");

//List<string> proxyList = new()
//            {
//                //"156.236.31.44:1580",
//                //"185.217.136.67:1337",
//                //"31.186.241.8:8888",
//                //"188.166.56.246:80",
//                "23.137.248.197",
//                "91.92.244.233",
//                "31.186.241.8",
//                "45.87.154.214" //8118
//            };

var proxyList = await Henk.GetProxies();

foreach (var item in proxyList)
{
    Henk.DoIt(item);    
}

public class Henk
{
    private const short MAX_RESPONSE_TIME_MS = 3000;
    private const bool MUST_RETURN_STATUS_SUCCES = true;

    public static void DoIt(string who)
    {
        AutoResetEvent waiter = new AutoResetEvent(false);

        Ping pingSender = new Ping();
        pingSender.PingCompleted += new PingCompletedEventHandler(Henk.PingCompletedCallback);

        string data = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        byte[] buffer = Encoding.ASCII.GetBytes(data);

        int timeout = 12000;

        PingOptions options = new PingOptions(64, true);
        pingSender.SendAsync(who, timeout, buffer, options, waiter);

        waiter.WaitOne();
    }

    public static void PingCompletedCallback(object sender, PingCompletedEventArgs e)
    {
        // If the operation was canceled, display a message to the user.
        if (e.Cancelled)
        {
            Console.WriteLine("Ping canceled.");

            ((AutoResetEvent)e.UserState).Set();
        }

        if (e.Error != null)
        {
            Console.WriteLine("Ping failed:");
            Console.WriteLine(e.Error.ToString());

            ((AutoResetEvent)e.UserState).Set();
        }

        PingReply reply = e.Reply;

        DisplayReply(reply);

        ((AutoResetEvent)e.UserState).Set();
    }

    public static void DisplayReply(PingReply reply)
    {
        if (reply == null)
            return;

        if (reply.Status == IPStatus.Success)
        {
            Console.WriteLine($"[{reply.Status}] [{reply.RoundtripTime}ms] {reply.Address}");
        }
    }

    public static async Task<List<string>> GetProxies()
    {
        using (var httpClient = new HttpClient())
        {
            const string PROXY_LIST_URL = "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&country=nl&protocol=http&proxy_format=ipport&format=text&timeout=20000";

            var requestMsg = new HttpRequestMessage()
            {
                RequestUri = new Uri(PROXY_LIST_URL),
                Method = HttpMethod.Get
            };
            
            var requestRes = await httpClient.SendAsync(requestMsg);

            var res = await requestRes.Content.ReadAsStringAsync();

            //var proxyList = JsonConvert.DeserializeObject<List<string>>(httpResponseContent, _jsonSerializerSettings);

            return new();
        }
    }
}
