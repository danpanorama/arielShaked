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


  }finally{
    dispatch({
      type: STOP_LOAD
    }) 
  }

  
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
        type: CLEAR,
        
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


export const addNewEmployee = (data) => async (dispatch) => {
  try {
    dispatch({ type: START_LOAD });
    console.log(data)

    const res = await axiosInstance.post("/login/signup", data, {
      withCredentials: true,
    });

    if (res.data.error) {
      dispatch({ type: ERROR, data: {
        message: res.data.error.message,
        header: res.data.error.header
      }});
      return null;
    }

    dispatch({ type: STOP_LOAD });

    // החזר את המשתמש החדש
    return res.data.user;

  } catch (err) {
    const errorMessage = err.response?.data?.message || "אנה נסו שנית מאוחר יותר";
    dispatch({ type: ERROR, data: {
      message: errorMessage,
      header: 'שגיאה בעת התחברות משתמש חדש'
    }});
    return null;
  } finally {
    dispatch({ type: STOP_LOAD });
  }
};
