import { QueryClient, QueryClientProvider } from 'react-query';
import TestComp from './components/testcomp';
import './App.css';
import Login from './components/login';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            structuralSharing: false
        }
    }
});

function App() {
    //useEffect(() => {
    //    function startGapi() {
    //        gapi.client.init({
    //            clientId: "289249593835-5pmogn6cs5f6hm1le1p4kqh45pdfvgej.apps.googleusercontent.com",
    //            scope: ""
    //        })
    //    }

    //    gapi.load('client:auth2', startGapi);
    //});

    return (
    <div className="App">
        <header className="App-header">
            <QueryClientProvider client={queryClient}>
                <TestComp/>
                <Login/>
            </QueryClientProvider>
      </header>
    </div>
  );
}

export default App;
