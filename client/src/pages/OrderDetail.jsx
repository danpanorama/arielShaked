// OrderDetail.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axiosInstance from "../config/AxiosConfig";
import Headers from "../components/header/Headers";
import "../css/order.css";

function OrderDetail() {
  const { orderId } = useParams(); // מקבל את מזהה ההזמנה מה-URL
  const navigate = useNavigate(); // לשימוש בניווט אחורה
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
   

    fetchOrderDetails();
  }, [orderId]);

   const fetchOrderDetails = async () => {
      try {
        const res = await axiosInstance.get(`/providers/orderNumber/${orderId}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (err) {
        setError("שגיאה בטעינת פרטי ההזמנה");
      }
    };

  const handleBack = () => {
    navigate(-1); // חזור לדף הקודם
  };

  return (
    <div className="orderDetailContainer">
      <Headers text="פרטי הזמנה" />
      <button onClick={handleBack} className="backButton">
        חזור
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {order ? (
        <div className="orderDetail">
          <h3>מספר הזמנה: {order.id}</h3>
          <p><strong>ספק:</strong> {order.provider_name}</p>
          <p><strong>מחיר:</strong> {order.price} ש"ח</p>
          <p><strong>סטטוס הזמנה:</strong> {order.is_approved === 0 ? "נשלח" : "קיבל"}</p>
          <p><strong>סטטוס תשלום:</strong> {order.is_paid === 0 ? "לא שולם" : "שולם"}</p>
          <p><strong>סכום ששולם:</strong> {order.amount_paid} ש"ח</p>
          <p><strong>תאריך יצירה:</strong> {order.created_at?.split("T")[0]}</p>
          <p><strong>זמן אספקה צפוי:</strong> {order.estimated_delivery_time ? order.estimated_delivery_time.split("T")[0] : "לא צויין"}</p>

          <h4>פרטי המוצרים:</h4>
          <ul>
            {order.items?.map((item, index) => (
              <li key={index}>
                <p><strong>שם מוצר:</strong> {item.product_name}</p>
                <p><strong>כמות:</strong> {item.quantity}</p>
                <p><strong>מחיר למוצר:</strong> {item.total_price} ש"ח</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>טוען פרטים...</p>
      )}
    </div>
  );
}

export default OrderDetail;
