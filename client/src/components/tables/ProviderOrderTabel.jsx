// components/orders/OrdersTable.jsx

import { Link } from "react-router-dom";
import "../../css/order.css";

function ProviderOrderTabel({
  orders,
  handlePaymentAmount,
  handlePaymentUpdate,
}) {
  if (orders.length === 0) {
    return <p>לא נמצאו הזמנות.</p>;
  }

  return (
    <div>
      <div className="legend">
        <p className="write">מקרא:</p>
        <span className="legend-item red"> לא שולם</span>
         <span className="legend-item orange">  שולם חלקית</span>
          <span className="legend-item green">  שולם</span>   
      </div>
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
          {orders.map((order) => (
            <tr
              className={order.is_paid === 1 ? "paid" : "unpaid"}
              key={order.id}
            >
              <td>
                <Link to={`/order/${order.id}`}>{order.id}</Link>
              </td>
              <td>{order.provider_name}</td>
              <td>{order.price}</td>
              <td>{order.created_at?.split("T")[0]}</td>
              <td>{order.is_approved === 0 ? "נשלח לספק" : "נקלט במלאי"}</td>
              <td
              // className={order.is_paid === 1 ? "paid" : "unpaid"}
              >
                {order.price <= order.amount_paid
                  ? "שולם"
                  : order.amount_paid > 0
                  ? "שולם חלקית"
                  : "לא שולם"}
              </td>
              <td>
                <input
                  onChange={handlePaymentAmount}
                  type="text"
                  placeholder={order.amount_paid}
                />
                <button
                  onClick={(e) => {
                    handlePaymentUpdate(order);
                  }}
                >
                  שלח
                </button>
              </td>
              <td>
                {order.estimated_delivery_time
                  ? order.estimated_delivery_time.split("T")[0]
                  : "לא צויין"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProviderOrderTabel;
