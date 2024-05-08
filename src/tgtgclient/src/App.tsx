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
