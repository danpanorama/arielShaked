import { useNavigate } from "react-router-dom";
import "../../App.css";
import "../../css/tools.css";

function BakeryOrdersCards({ bakeryOrders }) {
  const navigate = useNavigate();

  const handleClick = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const unapprovedOrders = bakeryOrders.filter(
    (order) => order.is_approved == 0 && order.estimated_ready_time == null
  );

  const approvedOrders = bakeryOrders.filter(
    (order) =>
      order.is_approved &&
      order.estimated_ready_time &&
      order.estimated_ready_time !== "0" &&
      order.is_finished === 0 // רק הזמנות שלא הסתיימו
  );

  if (bakeryOrders.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>אין הזמנות להצגה</p>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* הזמנות לא מאושרות */}
      <h2 style={{ textAlign: "center", color: "darkred" }}>
        הזמנות לא מאושרות
      </h2>
      <div
        className="orders-cards-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        {unapprovedOrders.length === 0 && <p>אין הזמנות לא מאושרות</p>}
        {unapprovedOrders.map((order) => {
          const orderDate =
            order.order_date && order.order_date !== "0"
              ? new Date(order.order_date).toLocaleDateString("he-IL")
              : "עוד לא התקבל";

          return (
            <div
              key={order.id}
              className="order-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "250px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                backgroundColor: "#f8d7da",
              }}
              onClick={() => handleClick(order.id)}
            >
              <h3>מספר הזמנה: {order.id}</h3>
              <p><strong>קטגוריה:</strong> {order.category}</p>
              <p><strong>תאריך הזמנה:</strong> {orderDate}</p>
              <p><strong>זמן הכנה מוערך:</strong> לא צויין עדיין</p>
              <p><strong>מאושרת:</strong> לא</p>
              <p><strong>נשלחה:</strong> {order.is_delivered ? "כן" : "לא"}</p>
            </div>
          );
        })}
      </div>

      {/* הזמנות מאושרות שלא הסתיימו */}
      <h2 style={{ textAlign: "center", color: "green" }}>
        הזמנות מאושרות שלא הסתיימו
      </h2>
      <div
        className="orders-cards-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {approvedOrders.length === 0 && <p>אין הזמנות מאושרות להצגה</p>}
        {approvedOrders.map((order) => {
          const orderDate =
            order.order_date && order.order_date !== "0"
              ? new Date(order.order_date).toLocaleDateString("he-IL")
              : "עוד לא התקבל";

          return (
            <div
              key={order.id}
              className="order-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "250px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                backgroundColor: "#d4f5d4",
              }}
              onClick={() => handleClick(order.id)}
            >
              <h3>מספר הזמנה: {order.id}</h3>
              <p><strong>קטגוריה:</strong> {order.category}</p>
              <p><strong>תאריך הזמנה:</strong> {orderDate}</p>
              <p><strong>זמן הכנה מוערך:</strong> {order.estimated_ready_time} דקות</p>
              <p><strong>מאושרת:</strong> כן</p>
              <p><strong>נשלחה:</strong> {order.is_delivered ? "כן" : "לא"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BakeryOrdersCards;
