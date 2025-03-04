import { Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import "./nav.css";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import HomeScreen from "../pages/HomeScreen";
import PrivateRouter from "../routers/PrivateRouter";


function NavRouter() {
  return (
    <div className="">
      <div className="position-sticky">
        <Nav />
      </div>
 

      <Routes>  
      <Route path="/" element={<PrivateRouter />} exact>
      <Route path="/" element={<HomeScreen />} exact />
      </Route>
      
      
      <Route path="/dashboard" element={<Dashboard />} exact />
      <Route path="*" element={<NotFound />} exact />
      </Routes>
    </div>
  );
}

export default NavRouter;