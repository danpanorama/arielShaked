// components/orders/OrdersTable.jsx

import { Link } from "react-router-dom";
import "../../css/order.css";

function ProviderOrderTabel({ orders }) {
  if (orders.length === 0) {
    return <p>לא נמצאו הזמנות.</p>;
  }

  return (
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
          <tr key={order.id}>
            <td>
              <Link to={`/order/${order.id}`}>{order.id}</Link>
            </td>
            <td>{order.provider_name}</td>
            <td className={order.is_paid === 1 ? "paid" : "unpaid"}>
              {order.price}
            </td>
            <td>{order.created_at?.split("T")[0]}</td>
            <td className={order.is_approved === 0 ? "pending" : "approved"}>
              {order.is_approved === 0 ? "נשלח" : "קיבל"}
            </td>
            <td className={order.is_paid === 1 ? "paid" : "unpaid"}>
              {order.is_paid === 1 ? "שולם" : "לא שולם"}
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
  );
}
 
export default ProviderOrderTabel;
