import axiosInstance from '../../config/AxiosConfig.jsx';
import { START_LOAD, STOP_LOAD } from '../contents/loaderContent.js';
import { ERROR, CLEAR } from "../contents/errContent.js";
import { CONNECT } from '../contents/connectContent.js';

export const checkUserAuthAction = (navigate, setAuthSuccess, from, currentLocation) => async (dispatch) => {
    dispatch({ type: START_LOAD });
    try {
        const response = await axiosInstance.get('/users/checkAuth', { withCredentials: true });
    
        if (response.data.success) {
            setAuthSuccess(true);
            navigate(from, { replace: true });
        } else {
            setAuthSuccess(false);
            navigate('/login', { state: { from: currentLocation }, replace: true });
        }
    } catch (error) {
        console.error('Authentication failed:', error.message);
        dispatch({ type: ERROR, data:{message:error.message,header:'error'}  });
        setAuthSuccess(false);
        navigate('/login', { state: { from: currentLocation }, replace: true });
    } finally {
        dispatch({ type: STOP_LOAD });
    }
}; 


export const signUpAction = (data) => async (dispatch) => {
    try {
        const res = await axiosInstance.post("/login/signup", data, { withCredentials: true });
        console.log(res)
        if(res.error){
            dispatch({type:ERROR,data:{message:res.error.message,header:res.error.header}})
            return
        }
        dispatch({type:CONNECT,data:res.data.user})
         
     
    } catch (err) {
        const errorMessage = err.response && err.response.data ? err.response.data.message : "אנה נסו שנית מאוחר יותר";
        
        dispatch({
            type: ERROR,
            data: {
                message: errorMessage,
                header: 'שגיאה בעת התחברות משתמש חדש '
            }
        });

        console.log(err);
    }
};




export const loginAction = (data) => async (dispatch) => {
    try {
      await axiosInstance.post("/login",data)
        .then((res) => {
          if (res.error) {  
            return dispatch({
              type: ERROR,
              data: res.error.message
            })
          } else {
      console.log(res.data)
         
          }
        }) 
        .catch((err) => {
            dispatch({
                type: ERROR,
                data: {
                    message: err.message||'שגיאה',
                    header: 'שגיאה בעת התחברות   '
                }
            });
        })
    } catch (e) {
        dispatch({
            type: ERROR,
            data: {
                message: e.message||'שגיאה',
                header: 'שגיאה בעת התחברות   '
            }
        });
    }
  }