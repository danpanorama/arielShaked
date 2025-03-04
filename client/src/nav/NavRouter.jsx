import { Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import "./nav.css";

import NotFound from "../pages/NotFound";


function NavRouter() {
  return (
    <div className="">
      <div className="position-sticky">
        <Nav />
      </div>

      <Routes>  
      
        <Route path="*" element={<NotFound />} exact />
      </Routes>
    </div>
  );
}

export default NavRouter;