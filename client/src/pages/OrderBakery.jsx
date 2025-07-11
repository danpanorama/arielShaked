import { useEffect, useState } from "react";
import "../App.css";
import "../css/order.css";
import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import OrderPopUp from "../components/popup/OrderPopUp";
import { START_LOAD, STOP_LOAD } from "../redux/contents/loaderContent";
import { CLEAR, ERROR } from "../redux/contents/errContent";
import { useDispatch } from "react-redux";
import axiosInstance from "../config/AxiosConfig";
import CartSidebar from "../components/cart/CartSidebar";
import BakeryOrdersTabels from "../components/tables/BakeryOrdersTabels";
import { io } from "socket.io-client";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";
import PlusIcon from '../images/plus.svg'

function OrderBakery() {
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [bakeryOrders, setBakeryOrders] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();
  const [filteredOrders, setFilteredOrders] = useState([]);

  const handleNewOrderClick = () => {
    getCategoryProducts({ category: "קפואים" });
    setShowPopup(true);
  };
  console.log(categoryProducts);
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
      setTimeout(() => {
        dispatch({ type: CLEAR });
      }, 3000);
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
      setTimeout(() => {
        dispatch({ type: CLEAR });
      }, 3000);
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
        setBakeryOrders(res.data.orders);
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
      setTimeout(() => {
        dispatch({ type: CLEAR });
      }, 2000);
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

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("order-time-updated", (updatedOrder) => {
      setBakeryOrders((prevOrders) => {
        const existingOrder = prevOrders.find(
          (order) => order.id === updatedOrder.id
        );

        if (existingOrder && existingOrder.is_approved === 1) {
          return prevOrders;
        }

        if (existingOrder) {
          console.log("עודכן זמן הזמנה:", updatedOrder);
          return prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
        } else {
          return [...prevOrders, updatedOrder];
        }
      });
    });

    socket.on("newOrder", (data) => {
      console.log(data);
      console.log("הגיעה הזמנה חדשה:", data.order);
      const newOrder = Array.isArray(data.order) ? data.order[0] : data.order;
      const orderObj = Array.isArray(newOrder) ? newOrder[0] : newOrder;
      setBakeryOrders((prevOrders) => [...prevOrders, orderObj]);
    });

    socket.on("order-time-updated-update", (fullOrder) => {
      setBakeryOrders((prevOrders) => {
        const existingOrder = prevOrders.find(
          (order) => order.id === fullOrder.id
        );

        // if (existingOrder && existingOrder.is_approved === 1) {
        //   return prevOrders;
        // }

        if (existingOrder) {
          console.log("עודכן זמן הזמנה:", fullOrder);
          return prevOrders.map((order) =>
            order.id === fullOrder.id ? fullOrder : order
          );
        } else {
          return [...prevOrders, fullOrder];
        }
      });
    });

    // NEW: מאזין לסיום הזמנה
    socket.on("order-finished", (finishedOrder) => {
      console.log("הזמנה הסתיימה:", finishedOrder);
      setBakeryOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== finishedOrder.id)
      );
    });

    return () => {
      socket.off("order-time-updated");
      socket.off("order-finished");
      socket.off("order-time-updated-update");
      socket.off("newOrder");
      socket.disconnect();
    };
  }, []);

  const handleSendOrder = async () => {
    try {
      dispatch({ type: START_LOAD });

      if (cart.length == 0) {
        setShowPopup(false);
        return;
      }

      const res = await axiosInstance.post(
        "/bakery/newOrder",
        {
          estimated_ready_time: 0,
          is_approved: 0,
          is_paid: 0,
          amount_paid: 0,
          is_delivered: 0,
          category: cart[0].category,
          items: cart,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        setShowPopup(false);
        setCart([]);

        // setBakeryOrders((prevOrders) => [...prevOrders, res.data.order[0][0]]);
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: ERROR,
        data: {
          message: err.response?.data?.message || "שגיאה בטעינת ההזמנות",
          header: err.response?.data?.header || "שגיאה בטעינת הזמנות",
        },
      });
      setTimeout(() => {
        dispatch({ type: CLEAR });
      }, 3000);
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  return (
    <div className="providersContainer posreld">
      <SideNavBar />
 
      <div className="flex-row-bet">
        <div></div> 


        <div className="flex-row-bet possr">
          <PrimaryButton icon={PlusIcon} click={handleNewOrderClick} text="הזמנה חדשה" />
        </div>
      </div>

         <h1 className="x22">
הזמנות אפייה
    </h1>

      {showPopup && (
        <OrderPopUp
          categoryProducts={categoryProducts}
          getCategoryProducts={getCategoryProducts}
          products={products}
          close={() => setShowPopup(false)}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          handleSendOrder={handleSendOrder}
        />
      )}

      {/* <CartSidebar handleSendOrder={handleSendOrder} cart={cart} /> */}
  
     

      <BakeryOrdersTabels
        bakeryOrders={filteredOrders.length > 0 ? filteredOrders : bakeryOrders}
      />
    </div>
  );
}

export default OrderBakery;
