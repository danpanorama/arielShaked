import { useState, useEffect } from "react";
import "../App.css";
import "../css/order.css";

import PrimaryButton from "../components/btn/PrimaryButton";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import ProvidersOrders from "../components/popup/ProvidersOrders";
import axiosInstance from "../config/AxiosConfig";
import { useDispatch } from "react-redux";
import { ERROR } from "../redux/contents/errContent";
import { START_LOAD, STOP_LOAD } from "../redux/contents/loaderContent";
import SearchBar from "../components/searchbar/SearchBar";

function SuplyScreen() {
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]); // סטייט שמחזיק את ההזמנות
  const [providersState, setProvidersState] = useState([]); // סטייט שמחזיק את הספקים
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProviders();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      dispatch({ type: START_LOAD });
      const response = await axiosInstance.get("/providers/getAllOrders", {
        withCredentials: true,
      });

      // בדיקה שהתגובה מכילה את הנתונים הצפויים
      if (response && response.data) {
        setOrders(response.data); // עדכון הסטייט של ההזמנות
      } else {
        throw new Error("לא התקבלו נתונים");
      }
    } catch (err) {
      console.error(err); // הדפסת השגיאה למסך הקונסול
      setError("שגיאה בטעינת ההזמנות: " + (err?.message || "לא ידוע"));
      dispatch({ type: ERROR });
    } finally {
      setLoading(false);
      dispatch({ type: STOP_LOAD });
    }
  };

  const fetchProviders = async () => {
    try {
      dispatch({ type: START_LOAD });
      const response = await axiosInstance.get("/providers", {
        withCredentials: true,
      });
      setProvidersState(response.data); // עדכון הסטייט של הספקים
    } catch (err) {
      setError("שגיאה בטעינת הספקים");
      dispatch({ type: ERROR });
    } finally {
      dispatch({ type: STOP_LOAD });
    }
  };

  const handleNewOrderClick = () => {
    setShowPopup(true); // מציג את החלון של הזמנה חדשה
  };

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="מלאי" />

      <div className="flex-row-bet">
        <SearchBar/>
        <PrimaryButton click={handleNewOrderClick} text="הזמנה חדשה" />
      </div>

{showPopup && (
  <ProvidersOrders
    providersState={providersState}
    close={() => setShowPopup(false)}
    setOrders={setOrders} // העברת הפונקציה כפרופס
  />
)}


      <div className="ordersList">
        {loading ? (
          <p>טוען נתונים...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : orders.length === 0 ? (
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
              </tr>
            </thead>
            <tbody>

              {orders.map((order) => (
                
                <tr key={order.id}>
                  {console.log(order)}
                  <td>{order.id}</td>
                  <td>{order.provider_name}</td>
                  <td>{order.price}</td>
                  <td>{order.created_at.split('T')[0]}</td>
                  <td>{order.is_approved==0?' לא מאושר':"מאושר"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SuplyScreen;
