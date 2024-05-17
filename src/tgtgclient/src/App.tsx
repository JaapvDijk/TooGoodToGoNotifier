import TestComp from './components/testcomp';
import { Route, Routes } from 'react-router-dom';
import MenuBar from './components/Header';
import { Container } from "@mui/material";
import Footer from './components/Footer';
import Banner from './components/Banner';
import './App.css';

function App() {
    return (
        <div className="App">
            <MenuBar />

            <Routes>
                <Route path="/" element={
                    <>
                        <Banner />
                        <Container maxWidth="lg" sx={{ padding: "0", textAlign: "center", minHeight: "500px" }}>
                            <TestComp />
                        </Container>
                    </>
                } />
            </Routes>
            <Routes>
                <Route path="/profile" element={
                    <Container maxWidth="lg" sx={{ padding: "0", textAlign: "center", minHeight: "500px" }}>
                        <TestComp />
                    </Container>
                } />
            </Routes>
            <Routes>
                <Route path="/shops" element={
                    <Container maxWidth="lg" sx={{ padding: "0", textAlign: "center", minHeight: "500px" }}>
                        <TestComp />
                    </Container>
                } />
            </Routes>
            <Routes>
                <Route path="/subscriptions" element={
                    <Container maxWidth="lg" sx={{ padding: "0", textAlign: "center", minHeight: "500px" }}>
                        <TestComp />
                    </Container>
                } />
            </Routes>

            <Footer />
    </div>
  );
}

export default App;
