import TestComp from './components/testcomp';
import './App.css';
import MenuBar from './components/MenuBar';

function App() {
    return (
    <div className="App">
        <header className="App-header">
            <MenuBar/>
            <TestComp/>
      </header>
    </div>
  );
}

export default App;
