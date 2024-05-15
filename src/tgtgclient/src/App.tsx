import TestComp from './components/testcomp';
import { Navigate, Route, Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import MenuBar from './components/MenuBar';

function App() {
    return (
        <div className="App">
            <MenuBar />
            <Routes>
                <Route path="/" element={
                    <>
                        <TestComp/>
                    </>
                } />
            </Routes>
    </div>
  );
}

export default App;
