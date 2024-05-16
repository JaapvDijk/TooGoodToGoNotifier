import TestComp from './components/testcomp';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import MenuBar from './components/MenuBar';
import { Container } from "@mui/material";
import Footer from './components/Footer';

function App() {
    return (
        <div className="App">
            <MenuBar />

            <Container maxWidth="lg" sx={{ padding: "0", textAlign: "center", minHeight: "500px" }}>

                <Routes>
                    <Route path="/" element={
                        <TestComp />
                    } />
                </Routes>
                <Routes>
                    <Route path="/profile" element={
                        <TestComp />
                    } />
                </Routes>
                <Routes>
                    <Route path="/shops" element={
                        <TestComp />
                    } />
                </Routes>
                <Routes>
                    <Route path="/shops" element={
                        <TestComp />
                    } />
                </Routes>

            </Container>

            <Footer />
    </div>
  );
}

export default App;
