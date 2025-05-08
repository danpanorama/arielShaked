import { useState, useEffect } from "react";
import "../App.css";
import "../css/order.css";

import PrimaryButton from "../components/btn/PrimaryButton";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import ProvidersOrders from "../components/popup/ProvidersOrders";
import axiosInstance from "../config/AxiosConfig";

function SuplyScreen() {
  const [showPopup, setShowPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [providersState, setProvidersState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/providers", {
        withCredentials: true,
      });
      console.log(response.data);
      setProvidersState(response.data);
    } catch (err) {
      setError("שגיאה בטעינת הספקים");
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrderClick = () => {
    setShowPopup(true);
  };

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="מלאי" />

      <div className="flex-row-bet">
        <PrimaryButton click={handleNewOrderClick} text="הזמנה חדשה" />
      </div>

      {showPopup && (
        <ProvidersOrders
          providersState={providersState}
          close={() => setShowPopup(false)}
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
                <th>תאריך</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {providersState.map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.id}</td>
                  <td>{provider.name}</td>
                  <td>{new Date(provider.date).toLocaleDateString()}</td>
                  <td>{provider.phone}</td>
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
