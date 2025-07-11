// OrderDetail.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axiosInstance from "../config/AxiosConfig";
import Headers from "../components/header/Headers";
import "../css/order.css";
import { CLEAR, ERROR } from '../redux/contents/errContent';
import { useDispatch } from "react-redux";
function OrderDetail() {
  const { orderId } = useParams(); // מקבל את מזהה ההזמנה מה-URL
  const navigate = useNavigate(); // לשימוש בניווט אחורה
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
const dispatch = useDispatch();

 useEffect(() => {
  fetchOrderDetails();
}, [orderId]);

useEffect(() => {
  if (order) {
    setAmountPaid(order.amount_paid || "");
  }
}, [order]);

const handlePaymentUpdate = async () => {
  try {
    await axiosInstance.post(
      "/providers/update-payment",
      {
        orderId: order.id,
        amountPaid: Number(amountPaid),
      },
      { withCredentials: true }
    );
    fetchOrderDetails();
    alert("התשלום עודכן בהצלחה");
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
          <p><strong>מחיר כל ההזמנה הכללת:</strong> {order.price} ש"ח</p>
          <p><strong>סטטוס הזמנה:</strong> {order.is_approved === 0 ? "נשלח" : "קיבל"}</p>
          <p><strong>סטטוס תשלום:</strong> {order.is_paid === 0 ? "לא שולם" : "שולם"}</p>
          {order.is_approved === 1 && (
  <div className="paymentUpdate">
    <label>סכום ששולם:</label>
    <input
      type="number"
      max={order.price}
      value={amountPaid}
      onChange={(e) => setAmountPaid(e.target.value)}
    />
    <button onClick={handlePaymentUpdate}>עדכן תשלום</button>
  </div>
)}

          <p><strong>תאריך יצירה:</strong> {order.created_at?.split("T")[0]}</p>
          <p><strong>זמן אספקה צפוי:</strong> {order.estimated_delivery_time ? order.estimated_delivery_time.split("T")[0] : "לא צויין"}</p>

          <h4>פרטי המוצרים:</h4>
          <ul>
            {order.items?.map((item, index) => (
              <li key={index}>
                <p><strong>שם מוצר:</strong> {item.product_name}</p>
                <p><strong>כמות שהוזמנה :</strong> {item.quantity}</p>
                  <p><strong>כמות שהתקבלה:</strong> {item.received_quantity}</p>
                  {console.log(item)}
                <p><strong>מחיר למוצר יחיד:</strong> {item.unit_price} ש"ח</p>

                
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
