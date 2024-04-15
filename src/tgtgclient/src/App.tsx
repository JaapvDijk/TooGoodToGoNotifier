import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Api } from './apiClient/Api';
import { User } from './apiClient/data-contracts';


function App() {
    const [data, setData] = useState<User[] | null>(null); //Any?
    //
    useEffect(() => {
        const fetchData = async () => {
            const api = new Api({
                baseUrl: "http://localhost:5000",
            });

            const res = await api.userList();
            setData(res.data);
            console.log(data);
        };

        fetchData();
    }, []);

    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
                    Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
