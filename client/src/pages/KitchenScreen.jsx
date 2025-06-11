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

function KitchenScreen() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newOrderPopup, setNewOrderPopup] = useState(null);
  const [estimatedTimes, setEstimatedTimes] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    loadAllProducts();
    loadAllBakeryOrders();
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.on("newOrder", (order) => {
      console.log('order',order.order)

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
        console.log(res.data);
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
      // עדכון הזמנה מקומית כדי להציג שינויים בלי לרענן את כל הרשימה
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, estimated_ready_time: estimatedTimes[order.id] }
            : o
        )
      );
      alert("הזמן עודכן בהצלחה");
    } catch (err) {
      console.log(err)
      dispatch({type:ERROR,data:{message:err.response?.data.error.message,header:'שגיאה'}})
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
      // עדכון הזמנה מקומית כדי להציג שינויים בלי לרענן את כל הרשימה
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, estimated_ready_time: estimatedTimes[order.id] }
            : o
        )
      );
      alert("הזמן עודכן בהצלחה");
    } catch (err) {
      console.log(err)
      dispatch({type:ERROR,data:{message:err.response?.data.error.message,header:'שגיאה'}})
     alert(err.response?.data?.error?.message || "שגיאה בעדכון זמן מוערך");
       setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };





  // סיום הזמנה (סימון כמוכנה)
  const finishOrder = async (order) => {
    try {
      dispatch({ type: START_LOAD });
      await axiosInstance.post(
        `/bakery/finish`,
        { order }, 
        { withCredentials: true }
      );
      // הסרת ההזמנה מהרשימה או עדכון הסטטוס
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      alert("ההזמנה הושלמה!");
    } catch (err) {
      alert("שגיאה בסימון ההזמנה כמוכנה");
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  // הזמנות ללא זמן מוערך
  const pendingOrders = orders.filter((o) => !o.estimated_ready_time && o.is_finished == 0);

  // הזמנות עם זמן מוערך
  const timedOrders = orders.filter((o) => o.estimated_ready_time&& o.is_finished == 0);

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="הזמנות ייצור" />
      <div className="flex-row-bet">
        <SearchBar />
      </div>

      <h3>הזמנות ללא זמן מוערך - הזן זמן הכנה</h3>
      <div className="orders-grid">
        {pendingOrders.length === 0 && <p>אין הזמנות ללא זמן מוערך כרגע</p>}
        {pendingOrders.map((order) => (
          <div key={order.id} className="order-box">
            <p>הזמנה #{order.id}</p>
            <p>קטגוריה: {order.category}</p>
            {order.items?.map((item, idx) => (
              <div key={idx}>
                <p>מוצר: {item.product_name}</p>
                <p>כמות: {item.quantity}</p>
              </div>
            ))}

            {/* כאן תוכל להוסיף פרטים נוספים מההזמנה */}
            <input
              type="number"
              min="1"
              placeholder="זמן הכנה בדקות"
              value={estimatedTimes[order.id] || ""}
              onChange={(e) => handleTimeChange(order.id, e.target.value)}
            />
            <PrimaryButton
              text="שלח זמן מוערך"
              click={() => sendEstimatedTime(order)}
            />
          </div>
        ))}
      </div>
      <br />
      <br />
      <br />
      <div className="flex-row-bet">
        <SearchBar />
      </div>

      <h3>הזמנות עם זמן מוערך - סיים הזמנה</h3>
      <div className="orders-grid">
        {timedOrders.length === 0 && <p>אין הזמנות עם זמן מוערך כרגע</p>}
        {timedOrders.map((order) => (
          <div key={order.id} className="order-box">
            <p>הזמנה #{order.id}</p>
            <p>קטגוריה: {order.category}</p>
            <p>זמן מוערך: {order.estimated_ready_time} דקות</p>
               <input
              type="number"
              min="1"
              placeholder="זמן הכנה בדקות"
              value={estimatedTimes[order.id] || ""}
              onChange={(e) => handleTimeChange(order.id, e.target.value)}
            />
            <PrimaryButton
              text="שלח זמן מוערך"
              click={() => updateEstimatedTime(order)}
            />
            <PrimaryButton text="סיים הזמנה" click={() => finishOrder(order)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default KitchenScreen;
