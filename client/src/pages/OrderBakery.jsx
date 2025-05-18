import { useEffect, useState } from "react";
import "../App.css";
import "../css/order.css";
import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import OrderPopUp from "../components/popup/OrderPopUp";
import { START_LOAD, STOP_LOAD } from "../redux/contents/loaderContent";
import { ERROR } from "../redux/contents/errContent";
import { useDispatch } from "react-redux";
import axiosInstance from "../config/AxiosConfig";
import CartSidebar from "../components/cart/CartSidebar";

function OrderBakery() {
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const dispatch = useDispatch();

  const handleNewOrderClick = () => {
    setShowPopup(true);
  };
  useEffect(() => {
    loadAllProducts();
    loadAllBakeryOrders();
  }, []);

  const loadAllProducts = async () => {
    try {
      dispatch({ type: START_LOAD });
      const res = await axiosInstance.get("/products/category", {
        withCredentials: true,
      });
      if (res.data) {
        console.log(res.data);
        setProducts(res.data);
      }
    } catch (err) {
      dispatch({
        type: ERROR,
        data: {
          message: "שגיאה בטעינת ההזמנות: ",
          header: err?.message || "לא ידוע",
        },
      });
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  async function getCategoryProducts(category) {
    try {
      dispatch({ type: START_LOAD });
      const res = await axiosInstance.get("/products/category/item", {
        params: category,
        withCredentials: true,
      });
      if (res.data) {
        console.log(res.data);

        setCategoryProducts(res.data);
      }
    } catch (err) {
      dispatch({
        type: ERROR,
        data: {
          message: "שגיאה בטעינת ההזמנות: ",
          header: err?.message || "לא ידוע",
        },
      });
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  }

  const loadAllBakeryOrders = async () => {
    try {
      dispatch({ type: START_LOAD });
      const res = await axiosInstance.get("/bakery", {
        withCredentials: true,
      });
      if (res.data) {
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: ERROR,
        data: {
          message: err.response?.data?.message || "שגיאה בטעינת ההזמנות: ",
          header: err.response?.data?.header || " שגיאה בטעינת הזמנות",
        },
      });
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

const addToCart = (product, quantity) => {
  setCart((prevCart) => {
    const existingProduct = prevCart.find((p) => p.id === product.id);
    if (existingProduct) {
      return prevCart.map((p) =>
        p.id === product.id ? { ...p, quantity } : p
      );
    } else {
      return [...prevCart, { ...product, quantity }];
    }
  });
};


const removeFromCart = (productId) => {
  setCart((prevCart) => prevCart.filter((p) => p.id !== productId));
};

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="הזמנות מאפייה" />
      <div className="flex-row-bet">
        <SearchBar />
        <div className="flex-row-bet">
          <PrimaryButton click={handleNewOrderClick} text="הזמנה חדשה" />
        </div>
      </div>

      {showPopup && (
        <OrderPopUp
          categoryProducts={categoryProducts}
          getCategoryProducts={getCategoryProducts}
          products={products}
          close={() => setShowPopup(false)}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}

      <CartSidebar cart={cart} />
    </div>
  );
}

export default OrderBakery;
