import { useDispatch } from 'react-redux';
import './App.css';
import ErrorComponents from './components/error/ErrorComponent';
import Loader from './components/loader/Loader';
import NavRouter from './nav/NavRouter';
import { CLEAR } from './redux/contents/errContent';

function App() {
  
  const dispatch = useDispatch()
  function clearError (){
    dispatch({type:CLEAR})
  }
  return (
    <div className="App" onClick={clearError} >
      <NavRouter/>


      <ErrorComponents/>
      <Loader/>

    </div>
  );
}

export default App;
