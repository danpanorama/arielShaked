

import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../config/AxiosConfig'; // ודא שיש לך את זה
import { ERROR } from '../redux/contents/errContent';
import { START_LOAD,STOP_LOAD } from '../redux/contents/loaderContent';
import { REMEMBER_ME } from '../redux/contents/connectContent';

const PrivateRouter = () => {
  const user = useSelector((state) => state.userData);
  const currentLocation = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authSuccess, setAuthSuccess] = useState(null);

  const from = currentLocation.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: START_LOAD });
        const response = await axiosInstance.get('/users/checkAuth', { withCredentials: true });
  
        if (response.data.success) {
          dispatch({type:REMEMBER_ME})
          setAuthSuccess(true);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (error) {
        console.error('Authentication failed:', error.message);
        dispatch({
          type: ERROR,
          data: {
            message: "זיהוי נכשל נא להתחבר או לפתוח משתמש",
            header: 'אתה לא מחובר, גש להתחבר'
          }
        });
        setAuthSuccess(false);
      } finally {
        dispatch({ type: STOP_LOAD });
      }
    };
  
    checkAuth();
  }, [currentLocation.pathname]); // 👈 זה עושה את הקסם
  

  if (authSuccess === null) {
    return <div>טוען...</div>;
  }

  return authSuccess ? <Outlet /> : <Navigate to="/login" state={{ from: currentLocation }} />;
};

export default PrivateRouter;


