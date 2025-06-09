import React, { useEffect, useState } from "react";
import "../../css/popup.css";
import axiosInstance from "../../config/AxiosConfig";
import { useDispatch } from "react-redux";
import { ERROR } from "../../redux/contents/errContent";
import OrderDetails from "./OrderDetails";

function ReceiveOrderPopup({ activePopUp,products,setOriginalProducts,setFilteredProducts }) {
  const dispatch = useDispatch();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  useEffect(() => {
    fetchUnapprovedOrders();
  }, []);
  const fetchUnapprovedOrders = async () => {
    try {
      const response = await axiosInstance.get("/providers/unapprovedOrders", {
        withCredentials: true,
      }); 

      setPendingOrders(response.data.orders || []);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בשליפת הזמנות",
          header: "שגיאה",
        },
      });
    }
  };
  const renderOrderTable = () => (
    <table className="ordersTable">
      <thead>
        <tr>
          <th>מספר הזמנה</th>
          <th>שם ספק</th>
          <th>תאריך צפוי</th>
          <th>סכום הזמנה</th>
        </tr>
      </thead>
      <tbody>
        {pendingOrders.map((order, index) => (
          <tr key={order.id} onClick={() => setSelectedOrderIndex(index)}>
       
            <td>{order.id}</td>
            <td>{order.providerName}</td>
            <td>{order.created_at.split('T')[0]}</td>
            <td>{order?.price || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="popupContainer2">
      <button className="closeBtn5" onClick={activePopUp}>X</button>
      <div className="popupContent">
        <h2>קליטת הזמנה למלאי</h2>
        {pendingOrders.length === 0 ? (
          <p>אין הזמנות להצגה</p>
        ) : selectedOrderIndex !== null ? (
          <OrderDetails
            order={pendingOrders[selectedOrderIndex]}
            orderIndex={selectedOrderIndex}
            setSelectedOrderIndex={setSelectedOrderIndex}
            setPendingOrders={setPendingOrders}
            dispatch={dispatch}
            products={products}
            setOriginalProducts={setOriginalProducts}

              setFilteredProducts={setFilteredProducts}
          />
        ) : (
          renderOrderTable()
        )}
      </div>
    </div>
  );
}

export default ReceiveOrderPopup;
