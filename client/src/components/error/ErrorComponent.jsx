import { useDispatch, useSelector } from 'react-redux';
import '../../css/error.css';
import { CLEAR } from '../../redux/contents/errContent';

function ErrorComponents() {
  const dispatch = useDispatch()

  const err = useSelector((state) => state.err);

  function closeErrorPopup(){
    dispatch({type:CLEAR})
  }


  return (
    <div onClick={closeErrorPopup} className={err.active_error?"ErrorComponents":"ErrorComponentsClose"}>
      <div className="error-box-message">
     <div className="inner-error-box">
     <h1 className='error-header'>{err.header}</h1>
        <p className="error-text">
          {err.message}
        </p>
     </div>
      </div>
     
      

    </div>
  ); 
}
 
export default ErrorComponents;
