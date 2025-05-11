import axiosInstance from '../../config/AxiosConfig.jsx';
import {
  START_LOAD,
  STOP_LOAD
} from '../contents/loaderContent.js';
import {
  ERROR,
  CLEAR
} from "../contents/errContent.js";
import {
  CONNECT
} from '../contents/connectContent.js';








export const signUpAction = (data, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: START_LOAD
    })

    const res = await axiosInstance.post("/login/signup", data, {
      withCredentials: true
    });

    if (res.data.error) {

   dispatch({
      type: STOP_LOAD
    })
      dispatch({
        type: ERROR,
        data: {
          message: res.data.error.message,
          header: res.data.error.header
        }
      })
      return
    }
    dispatch({
      type: CONNECT,
      data: res.data.user
    })
    dispatch({
      type: STOP_LOAD
    })

    navigate('/')


  } catch (err) {
    const errorMessage = err.response && err.response.data ? err.response.data.message : "אנה נסו שנית מאוחר יותר";
    dispatch({
      type: STOP_LOAD
    })
    dispatch({
      type: ERROR,
      data: {
        message: errorMessage,
        header: 'שגיאה בעת התחברות משתמש חדש '
      }
    });


<<<<<<< HEAD
  }finally{
    dispatch({
      type: STOP_LOAD
    })
  }
=======
  }finally {dispatch({type:STOP_LOAD})}
>>>>>>> laptop
};





export const loginAction = (data, navigate) => async (dispatch) => {
  try {
    dispatch({
      type: START_LOAD
    })
    const res = await axiosInstance.post("/login", data, {
      withCredentials: true
    });



    if (res.data.error) {
      dispatch({
        type: STOP_LOAD
      })
      dispatch({
        type: ERROR,
        data: res.data.error.message,
      });
    } else {
      dispatch({
        type: STOP_LOAD
      })
      dispatch({
        type: CONNECT,
        data: res.data.user,
      });
      dispatch({
        type: STOP_LOAD
      })
      navigate('/');
    }
  } catch (err) {
    dispatch({
      type: STOP_LOAD
    })
    dispatch({
      type: ERROR,
      data: {
        message: err.response.data.error.message || 'שגיאה',
        header: 'שגיאה בעת התחברות',
      },
    });
  }
};