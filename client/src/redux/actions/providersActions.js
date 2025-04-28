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
    ADD_PROVIDER,
    REMOVE_PROVIDER
} from '../contents/providersContent.js';



export const addProvider = (data) => async (dispatch) => {
    try {
        dispatch({type:START_LOAD})
        const res = await axiosInstance.post("/providers/addProvider", data, {
            withCredentials: true
        });
        if (res.data.error) {
            dispatch({type:STOP_LOAD})
            dispatch({
                type: ERROR,
                data: {
                    message: res.data.error.message,
                    header: res.data.error.header
                }
            })
            dispatch({type:STOP_LOAD})
            return
        }
        dispatch({type:STOP_LOAD})
        dispatch({
            type: ADD_PROVIDER,
            data: res.data.provider
        })
       


    } catch (err) {
        dispatch({type:STOP_LOAD})
        const errorMessage = err.response && err.response.data ? err.response.data.message : "אנה נסו שנית מאוחר יותר";
        dispatch({
            type: ERROR,
            data: {
                message: errorMessage,
                header: 'שגיאה בעת הוספת ספק חדש'
            }
        });

      
    }
};




export const removeProvider = (data) => async (dispatch) => {
    try {
        const res = await axiosInstance.post("/providers/removeProvider", data, {
            withCredentials: true
        });

        if (res.data.error) {
            dispatch({
                type: ERROR,
                data: res.data.error.message,
            });
        } else {
            dispatch({
                type: REMOVE_PROVIDER,
                data: data,
            });
          
        }
    } catch (err) {
        dispatch({
            type: ERROR,
            data: {
                message: err.message || 'שגיאה',
                header: 'שגיאה בעת הוספת ספק',
            },
        });
    }finally{
        dispatch({type:STOP_LOAD})
    }
};