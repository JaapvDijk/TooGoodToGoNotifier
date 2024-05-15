import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux";
import App from './App';
import './index.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { StyledEngineProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            structuralSharing: false
        }
    }
});

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId="289249593835-5pmogn6cs5f6hm1le1p4kqh45pdfvgej.apps.googleusercontent.com">
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <StyledEngineProvider injectFirst>
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </StyledEngineProvider>
                    </PersistGate>
                </Provider>
                </GoogleOAuthProvider>
            </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
