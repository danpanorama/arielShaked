import { Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import "./nav.css";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import HomeScreen from "../pages/HomeScreen";
import PrivateRouter from "../routers/PrivateRouter";
import LoginRouter from '../routers/LoginRouter'
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Providers from "../pages/Providers";
import Product from "../pages/Product";
import ProvidersProducts from "../pages/ProvidersProducts";
import Users from "../pages/Users";
import OrderBakery from "../pages/OrderBakery";
import SuplyScreen from "../pages/SuplyScreen";


function NavRouter() {
  return (
    <div className="">
      <div className="position-sticky">
        <div className="space">
          
        </div>
        <Nav />
      </div>
 

      <Routes>  
      <Route path="/login" element={<Login />} exact />
      <Route path="/sign-up" element={<SignUp />} exact />
      <Route path="/" element={<PrivateRouter />} exact>
      <Route path="/" element={<Dashboard />} exact />
      </Route>
      <Route path="/providers" element={<PrivateRouter />} exact>
      <Route path="/providers" element={<Providers />} exact />
      </Route>
      <Route path="/providersOrders" element={<PrivateRouter />} exact>
      <Route path="/providersOrders" element={<SuplyScreen />} exact />
      </Route>
      <Route path="/orders" element={<PrivateRouter />} exact>
      <Route path="/orders" element={<OrderBakery />} exact />
      </Route>
      <Route path="/products" element={<PrivateRouter />} exact>
      <Route path="/products" element={<Product />} exact />
      </Route>
      <Route path="/users" element={<PrivateRouter />} exact>
      <Route path="/users" element={<Users />} exact />
      </Route>
      <Route path="/providersProducts" element={<PrivateRouter />} exact>
      <Route path="/providersProducts" element={<ProvidersProducts />} exact />
      </Route>
      <Route path="*" element={<NotFound />} exact />

      </Routes>
    </div>
  );
}

export default NavRouter;