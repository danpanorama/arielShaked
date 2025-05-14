// שמור את הקובץ בשם OrderProvider.jsx

import { useState, useEffect } from "react";
import "../App.css";
import "../css/order.css";
import { Link } from "react-router-dom";
import PrimaryButton from "../components/btn/PrimaryButton";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import CreateOrderPopup from "../components/popup/CreateOrderPopup";
import SearchBar from "../components/searchbar/SearchBar";
import axiosInstance from "../config/AxiosConfig";
import { useDispatch } from "react-redux";
import { ERROR } from "../redux/contents/errContent";
import { START_LOAD, STOP_LOAD } from "../redux/contents/loaderContent";

function OrderProvider() {
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [providers, setProviders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [cart, setCart] = useState([]);
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
      } else {
        throw new Error("לא התקבלו נתונים מהשרת");
      }
    } catch (err) {
      setError("שגיאה בטעינת ההזמנות: " + (err?.message || "לא ידוע"));
      dispatch({ type: ERROR });
    } finally {
      setLoading(false);
      dispatch({ type: STOP_LOAD });
    }
  };

  const loadProviders = async () => {
    try {
      dispatch({ type: START_LOAD });
      const res = await axiosInstance.get("/providers", {
        withCredentials: true,
      });
      setProviders(res.data);
    } catch (err) {
      setError("שגיאה בטעינת הספקים");
      dispatch({ type: ERROR });
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  const handleSearch = (query) => {
    const filtered = orders.filter((order) =>
      order.provider_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filtered);
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
        data: err?.response?.data?.message || "שגיאה בטעינת מוצרים",
      });
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
        };

        const res = await axiosInstance.post(
          "/providers/providersOrders",
          orderToSend,
          { withCredentials: true }
        );

        setFilteredOrders((prev) => [...prev, res.data.order]);
        setOrders((prev) => [...prev, res.data.order]);
      }
      setShowPopup(false);
      setSelectedProvider(null);
      setProducts([]);
      setCart([]);
    } catch (err) {
      dispatch({ type: ERROR, data: { message: "שליחת ההזמנה נכשלה" } });
    }
  };

  const addToCart = (item, quantity) => {
    setCart((prevCart) => {
      const providerId = selectedProvider.id;
      const providerName = selectedProvider.name;
      const itemToAdd = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
      };

      const providerCart = prevCart.find((c) => c.providerId === providerId);
      if (providerCart) {
        const existingItem = providerCart.items.find((i) => i.id === item.id);
        const updatedItems = existingItem
          ? providerCart.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
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

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.providerId === selectedProvider.id
          ? { ...c, items: c.items.filter((i) => i.id !== item.id) }
          : c
      )
    );
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity <= 0) return;
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.providerId === selectedProvider.id
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, quantity } : i
              ),
            }
          : c
      )
    );
  };

  const currentCart = cart.find((c) => c.providerId === selectedProvider?.id);

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="הזמנות מספקים" />
      <div className="flex-row-bet">
        <SearchBar onSearch={handleSearch} />
        <PrimaryButton click={() => setShowPopup(true)} text="הזמנה חדשה" />
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
        ) : filteredOrders.length === 0 ? (
          <p>לא נמצאו הזמנות.</p>
        ) : (
          <table className="ordersTable">
            <thead>
              <tr>
                <th>מספר הזמנה</th>
                <th>ספק</th>
                <th>מחיר</th>
                <th>תאריך</th>
                <th>סטטוס</th>
                <th>סטטוס תשלום</th>
                <th>סכום ששולם</th>
                <th>זמן אספקה צפוי</th>
              </tr>
            </thead>

           <tbody>
  {filteredOrders.map((order) => (
    <tr key={order.id}>
      <td>
        <Link to={`/order/${order.id}`}>{order.id}</Link>
      </td>
      <td>{order.provider_name}</td>
      <td className={order.is_paid === 0 ? "unpaid" : "paid"}>
        {order.price}
      </td>
      <td>{order.created_at?.split("T")[0]}</td>
      <td className={order.is_approved === 0 ? "pending" : "approved"}>
        {order.is_approved === 0 ? "נשלח" : "קיבל"}
      </td>
      <td className={order.is_paid === 0 ? "unpaid" : "paid"}>
        {order.is_paid === 0 ? "לא שולם" : "שולם"}
      </td>
      <td>{order.amount_paid}</td>
      <td>
        {order.estimated_delivery_time
          ? order.estimated_delivery_time.split("T")[0]
          : "לא צויין"}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrderProvider;
