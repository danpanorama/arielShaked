// שמור את הקובץ בשם OrderProvider.jsx

import { useState, useEffect } from "react";
import "../App.css";
import "../css/order.css";
import { Link } from "react-router-dom";
import Icon from "../images/plus.svg";
import PrimaryButton from "../components/btn/PrimaryButton";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import CreateOrderPopup from "../components/popup/CreateOrderPopup";
import SearchBar from "../components/searchbar/SearchBar";
import axiosInstance from "../config/AxiosConfig";
import { useDispatch } from "react-redux";
import { CLEAR, ERROR } from "../redux/contents/errContent";
import { START_LOAD, STOP_LOAD } from "../redux/contents/loaderContent";
import ProviderOrderTabel from "../components/tables/ProviderOrderTabel";

function OrderProvider() {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [providers, setProviders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [cart, setCart] = useState([]);
  const [amount, setAmount] = useState(0);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadProviders();
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      dispatch({ type: START_LOAD });
      const res = await axiosInstance.get("/providers/getAllOrders", {
        withCredentials: true,
      });
      if (res.data) {
        setOrders(res.data);
        setFilteredOrders(res.data);
        setLoading(false);
      } else {
        throw new Error("לא התקבלו נתונים מהשרת");
      }
    } catch (err) {
      setError("שגיאה בטעינת ההזמנות: " + (err?.message || "לא ידוע"));
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

  const loadProviders = async () => {
    try {
      dispatch({ type: START_LOAD });
      const res = await axiosInstance.get("/providers", {
        withCredentials: true,
      });
      const activeProviders = res.data.filter(
        (provider) => provider.is_active === 1
      );
      setProviders(activeProviders);
      setLoading(false);
    } catch (err) {
      setError("שגיאה בטעינת הספקים");
      dispatch({ type: ERROR,data: {
          message:"שגיאה בטעינת הספקים",
          header: "שגיאה",
        } });
         setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  const handleSearch = (query) => {
    const loweredQuery = query.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.provider_name.toLowerCase().includes(loweredQuery) ||
        String(order.id).includes(loweredQuery) // או order.order_id תלוי בשם השדה
    );

    setFilteredOrders(filtered);
  };

  function handlePaymentAmount(e) {
    setAmount(e.target.value);
  }

  const handlePaymentUpdate = async (order) => {
    try {
      if (amount <= 0) {
        return;
      }
      const res = await axiosInstance.post(
        "/providers/update-payment",
        {
          orderId: order.id,
          amountPaid: Number(amount),
        },
        { withCredentials: true }
      );

      const updatedOrder = order;

      const payment = res.data?.allPayments; // ודא שאתה מקבל את זה נכון מהשרת

      setOrders((prevOrders) =>
        prevOrders.map((o) => {
          if (o.id === order.id) {
            const updatedAmountPaid = payment;
            const isFullyPaid = o.price <= updatedAmountPaid;
            return {
              ...o,
              amount_paid: updatedAmountPaid,
              is_paid: isFullyPaid ? 1 : 0,
            };
          }
          return o;
        })
      );

      setFilteredOrders((prevFiltered) =>
        prevFiltered.map((o) => {
          if (o.id === order.id) {
            const updatedAmountPaid = payment;
            const isFullyPaid = o.price <= updatedAmountPaid;
            return {
              ...o,
              amount_paid: updatedAmountPaid,
              is_paid: isFullyPaid ? 1 : 0,
            };
          }
          return o;
        })
      );

      // אופציונלי: איפוס שדה תשלום לאחר ההצלחה
      setAmount(0);
    } catch (err) {
      dispatch({
        type: ERROR,
        data: {
          message: err?.response?.data?.message || "שגיאה בעדכון התשלום",
          header: "שגיאה",
        },
      });
         setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    }
  };

  const fetchProducts = async (provider) => {
    try {
      setLoadingProducts(true);
      const res = await axiosInstance.post(
        "/providers/items",
        { providerId: provider.id },
        { withCredentials: true }
      );

     
      setProducts(res.data.items);
      setSelectedProvider(provider);
    } catch (err) {
      dispatch({
        type: ERROR,
        data:{message:'ספק לא משוייך',header:"שגיאה "},
      });
         setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    } finally {
      setLoadingProducts(false);
    }
  };

  const sendOrder = async () => {
    try {
      for (const providerCart of cart) {
        const totalPrice = providerCart.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        
        const orderToSend = {
          provider_id: providerCart.providerId,
          provider_name: providerCart.providerName,
          price: totalPrice,
          items: providerCart.items,
          estimated_delivery_time:selectedProvider.delivery_time
        };
    

        const res = await axiosInstance.post(
          "/providers/providersOrders",
          orderToSend, 
          { withCredentials: true }
        );
        console.log(res.data.order);

        setFilteredOrders((prev) => [res.data.order, ...prev]);
        setOrders((prev) => [res.data.order, ...prev]);
      }
      setShowPopup(false);
      setSelectedProvider(null);
      setProducts([]);
      setCart([]);
    } catch (err) {
      dispatch({ type: ERROR, data: { message: "שליחת ההזמנה נכשלה" } });
         setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    }
  };

  const addToCart = (item, quantity) => {
    if (quantity <= 0) {
      return;
    }
    if(item.min_order_quantity > quantity){
    return  alert('הכמות המינימלית להזמנה היא ' + item.min_order_quantity)
    }
 console.log(item)
    
    setCart((prevCart) => {
      const providerId = selectedProvider.id;
      const providerName = selectedProvider.name;

      const itemToAdd = {
        id: item.item_number,
        name: item.name,
        price: item.price,
        quantity,
      };

      const providerCart = prevCart.find((c) => c.providerId === providerId);
      if (providerCart) {
        const existingItem = providerCart.items.find((i) => i.id === item.id);
        const updatedItems = existingItem
          ? providerCart.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Number(i.quantity) + Number(quantity) }
                : i
            )
          : [...providerCart.items, itemToAdd];
        return prevCart.map((c) =>
          c.providerId === providerId ? { ...c, items: updatedItems } : c
        );
      } else {
        return [
          ...prevCart,
          {
            providerId,
            providerName,
            items: [itemToAdd],
          },
        ];
      }
    });
  };

  const removeFromCart = (item, quantity) => {
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.providerId === selectedProvider.id
          ? { ...c, items: c.items.filter((i) => i.id !== item.id) }
          : c
      )
    );
    quantity(1);
  };
  const handleQuantityChange = (itemId, quantity) => {
    // וודא שהכמות חיובית
    if (quantity <= 0) return;
    setCart((prevCart) => {
      const providerId = selectedProvider.id;
      const providerName = selectedProvider.name;
      const updatedCart = prevCart.map((c) =>
        c.providerId === providerId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, quantity } : i
              ),
            }
          : c
      );
      return updatedCart;
    });
  };

  const currentCart = cart.find((c) => c.providerId === selectedProvider?.id);

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="הזמנות מספקים" />
      <div className="flex-row-bet">
        <SearchBar onSearch={handleSearch} />
        <PrimaryButton
          icon={Icon}
          click={() => setShowPopup(true)}
          text="הוספת הזמנה חדשה"
        />
      </div>

      {showPopup && (
        <CreateOrderPopup
          providersList={providers}
          close={() => setShowPopup(false)}
          setOrders={setOrders}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          fetchProducts={fetchProducts}
          loadingProducts={loadingProducts}
          products={products}
          currentCart={currentCart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          handleQuantityChange={handleQuantityChange}
          showCart={showCart}
          setShowCart={setShowCart}
          sendOrder={sendOrder}
        />
      )}

      <div className="ordersList">
        {loading ? (
          <p>טוען נתונים...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ProviderOrderTabel
            handlePaymentUpdate={handlePaymentUpdate}
            handlePaymentAmount={handlePaymentAmount}
            orders={filteredOrders}
          />
        )}
      </div>
    </div>
  );
}

export default OrderProvider;
