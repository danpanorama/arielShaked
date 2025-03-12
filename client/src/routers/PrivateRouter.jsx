// import React, { useEffect, useState } from 'react';
// import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { checkUserAuthAction } from '../redux/actions/userActions';

// const PrivateRouter = () => {
//   const user = useSelector((state) => state.userData);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const [authSuccess, setAuthSuccess] = useState(null);

//   const from = location.state?.from?.pathname || "/dashboard";

//   useEffect(() => {
//     dispatch(checkUserAuthAction(navigate, setAuthSuccess, from));
//   }, [dispatch, navigate, from]);

//   if (authSuccess === null) {
//     return <div>טוען...</div>;
//   }

//   return authSuccess ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
// };

// export default PrivateRouter;
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkUserAuthAction } from '../redux/actions/userActions';

const PrivateRouter = () => {
  const user = useSelector((state) => state.userData);
  const currentLocation = useLocation(); // שינוי שם ל-currentLocation
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [authSuccess, setAuthSuccess] = useState(null);

  const from = currentLocation.state?.from?.pathname || "/dashboard"; // שימוש ב-currentLocation

  useEffect(() => {
    dispatch(checkUserAuthAction(navigate, setAuthSuccess, from, currentLocation));
  }, [dispatch, navigate, from, currentLocation]);

  if (authSuccess === null) {
    return <div>טוען...</div>;
  }

  return authSuccess ? <Outlet /> : <Navigate to="/login" state={{ from: currentLocation }} />;
};

export default PrivateRouter;
