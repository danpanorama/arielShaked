import './App.css';
import ErrorComponents from './components/error/ErrorComponent';
import Loader from './components/loader/Loader';
import NavRouter from './nav/NavRouter';

function App() {
  return (
    <div className="App">
      <NavRouter/>


      <ErrorComponents/>
      <Loader/>

    </div>
  );
}

export default App;
