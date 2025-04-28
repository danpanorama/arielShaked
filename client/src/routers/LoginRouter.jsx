import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const LoginRouter = () => {
    const user = useSelector((state) => state.userData);
    const isAuth = user?.isLoggedIn || false;
  
    const currentLocation = useLocation();
  
    if (!isAuth) {
      return <Navigate to="/dashboard" state={{ from: currentLocation }} />;
    }
  
    return <Outlet />;
  };
  
  export default LoginRouter;
  