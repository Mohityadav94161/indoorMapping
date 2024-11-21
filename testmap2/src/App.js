import logo from './logo.svg';
import './App.css';
import MallMap from './components/MapContainer';


function App() {
  return (
    <div className="App">
      <MallMap src="A" dest="B" />
    </div>
  );
}

export default App;
