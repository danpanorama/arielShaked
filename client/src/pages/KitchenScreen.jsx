import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../App.css";
import "../css/order.css";
import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import { START_LOAD, STOP_LOAD } from "../redux/contents/loaderContent";
import { CLEAR, ERROR } from "../redux/contents/errContent";
import { useDispatch } from "react-redux";
import axiosInstance from "../config/AxiosConfig";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm"; // וודא שיש את הפונקציה הזו בקובץ המתאים

function KitchenScreen() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newOrderPopup, setNewOrderPopup] = useState(null);
  const [estimatedTimes, setEstimatedTimes] = useState({});
  const [searchPending, setSearchPending] = useState(""); // חיפוש להזמנות ללא זמן מוערך
  const [searchTimed, setSearchTimed] = useState(""); // חיפוש להזמנות עם זמן מוערך

  const dispatch = useDispatch();

  useEffect(() => {
    loadAllProducts();
    loadAllBakeryOrders();
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.on("newOrder", (order) => {
      console.log('order',order.order);
      setOrders((prevOrders) => [order.order, ...prevOrders]);
      setNewOrderPopup(order);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
    return () => {
      socket.disconnect();
    };
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

  const loadAllBakeryOrders = async () => {
    try {
      dispatch({ type: START_LOAD });
      const res = await axiosInstance.get("/bakery", { withCredentials: true });
      if (res.data) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      dispatch({
        type: ERROR,
        data: {
          message: err.response?.data?.message || "שגיאה בטעינת ההזמנות: ",
          header: err.response?.data?.header || " שגיאה בטעינת הזמנות",
        },
      });
      setTimeout(() => {
        dispatch({ type: CLEAR });
      }, 3000);
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  const handleTimeChange = (orderId, value) => {
    setEstimatedTimes((prev) => ({ ...prev, [orderId]: value }));
  };

  const sendEstimatedTime = async (order) => {
    if (!estimatedTimes[order.id]) {
      alert("נא להכניס זמן תקין");
      return;
    }
    try {
      dispatch({ type: START_LOAD });
      await axiosInstance.post(
        `/bakery/estimated-time`,
        { estimated_ready_time: estimatedTimes[order.id], order_id: order.id },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, estimated_ready_time: estimatedTimes[order.id] }
            : o
        )
      );
      alert("הזמן עודכן בהצלחה");
    } catch (err) {
      console.log(err);
      dispatch({ type: ERROR, data: { message: err.response?.data.error.message, header: "שגיאה" } });
      alert(err.response?.data?.error?.message || "שגיאה בעדכון זמן מוערך");
      setTimeout(() => {
        dispatch({ type: CLEAR });
      }, 3000);
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  const updateEstimatedTime = async (order) => {
    if (!estimatedTimes[order.id]) {
      alert("נא להכניס זמן תקין");
      return;
    }
    try {
      dispatch({ type: START_LOAD });
      await axiosInstance.post(
        `/bakery/estimated-update-time`,
        { estimated_ready_time: estimatedTimes[order.id], order_id: order.id },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, estimated_ready_time: estimatedTimes[order.id] }
            : o
        )
      );
      alert("הזמן עודכן בהצלחה");
    } catch (err) {
      console.log(err);
      dispatch({ type: ERROR, data: { message: err.response?.data.error.message, header: "שגיאה" } });
      alert(err.response?.data?.error?.message || "שגיאה בעדכון זמן מוערך");
      setTimeout(() => {
        dispatch({ type: CLEAR });
      }, 3000);
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  const finishOrder = async (order) => {
    try {
      dispatch({ type: START_LOAD });
      await axiosInstance.post(`/bakery/finish`, { order }, { withCredentials: true });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      alert("ההזמנה הושלמה!");
    } catch (err) {
      alert("שגיאה בסימון ההזמנה כמוכנה");
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  const pendingOrders = orders.filter((o) => !o.estimated_ready_time && o.is_finished == 0);
  const timedOrders = orders.filter((o) => o.estimated_ready_time && o.is_finished == 0);

  // סינון לפי חיפוש
  const filteredPending = filterBySearchTerm(pendingOrders, searchPending, ["id", "items"], (value) => {
    // כדי לחפש גם בשמות מוצרים בתוך items, נהפוך את הערך למחרוזת מתאימה
    if (Array.isArray(value)) {
      return value.map(i => i.product_name).join(" ");
    }
    return value;
  });

  const filteredTimed = filterBySearchTerm(timedOrders, searchTimed, ["id", "items"], (value) => {
    if (Array.isArray(value)) {
      return value.map(i => i.product_name).join(" ");
    }
    return value;
  });

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="הזמנות ייצור" />

      <h3>הזמנות ללא זמן מוערך - הזן זמן הכנה</h3>
      <SearchBar onSearch={setSearchPending} />
      <div className="orders-grid ">
        {filteredPending.length === 0 && <p>אין הזמנות ללא זמן מוערך כרגע</p>}
        {filteredPending.map((order) => (
          <div key={order.id} className="order-box bbgg flexendCol">
           

           <div className="flexcol">
             <p>הזמנה #{order.id}</p>
             {order.items?.map((item, idx) => (
              <div key={idx}>
                <p>{item.product_name} - {item.quantity}</p>
              </div>
            ))}
           </div>

          <div className="flexend">
              <input
              type="number"
              min="1"
              placeholder="זמן הכנה בדקות"
              value={estimatedTimes[order.id] || ""}
              onChange={(e) => handleTimeChange(order.id, e.target.value)}
            />
            <PrimaryButton text="שלח זמן מוערך" click={() => sendEstimatedTime(order)} />
          </div>
          </div>
        ))}
      </div>

      <br /><br /><br />

      <h3>הזמנות עם זמן מוערך - סיים הזמנה</h3>
      <SearchBar onSearch={setSearchTimed} />
      <div className="orders-grid">
        {filteredTimed.length === 0 && <p>אין הזמנות עם זמן מוערך כרגע</p>}
        {filteredTimed.map((order) => (
          <div key={order.id} className="order-boxg">
            <p>הזמנה #{order.id}</p>
            <p>זמן מוערך: {order.estimated_ready_time} דקות</p>

   {order.items?.map((item, idx) => (
              <div key={idx}>
                <p>{item.product_name} - {item.quantity}</p>
              </div>
            ))}

            <input
              type="number"
              min="1"
              placeholder="זמן הכנה בדקות"
              value={estimatedTimes[order.id] || ""}
              onChange={(e) => handleTimeChange(order.id, e.target.value)}
            />
            <PrimaryButton text="עדכן זמן מוערך" click={() => updateEstimatedTime(order)} />
            <PrimaryButton text="אישור וסיום הזמנה" click={() => finishOrder(order)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default KitchenScreen;
