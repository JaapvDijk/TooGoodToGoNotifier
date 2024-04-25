import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import TestComp from './components/testcomp/testcomp';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            structuralSharing: false
        }
    }
});

function App() {
    return (
    <div className="App">
        <header className="App-header">
        {/*<Router>*/}
            <QueryClientProvider client={queryClient}>
                <TestComp/>
            </QueryClientProvider>
        {/*</Router>*/}
      </header>
    </div>
  );
}

export default App;
