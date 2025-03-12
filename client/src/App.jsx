import './App.css';
import ErrorComponents from './components/error/ErrorComponent';
import NavRouter from './nav/NavRouter';

function App() {
  return (
    <div className="App">
      <NavRouter/>


      <ErrorComponents/>

    </div>
  );
}

export default App;
