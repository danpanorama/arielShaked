import { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/order.css";
import { sortArray } from "../../components/tools/sort"; // אותו sortArray כמו קודם

function ProviderOrderTabel({
  orders,
  handlePaymentAmount,
  handlePaymentUpdate,
}) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

 

const normalizedOrders = orders.map(order => ({
  ...order,
  approval_rank: order.is_approved === 0 ? 0 : 1,
  payment_status_rank:
    order.price <= order.amount_paid ? 2 : order.amount_paid > 0 ? 1 : 0,
}));

const sortedOrders = sortArray(normalizedOrders, sortField, sortOrder);



  if (orders.length === 0) {
    return <p>לא נמצאו הזמנות.</p>;
  }

  return (
    <div>
      <div className="legend">
        <p className="write">מקרא:</p>
        <span className="legend-item red"> לא שולם</span>
        <span className="legend-item orange"> שולם חלקית</span>
        <span className="legend-item green"> שולם</span>
      </div>

      <table className="ordersTable">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              מספר הזמנה {sortField === "id" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th onClick={() => handleSort("provider_name")}>
              ספק {sortField === "provider_name" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th onClick={() => handleSort("price")}>
              מחיר {sortField === "price" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th onClick={() => handleSort("created_at")}>
              תאריך הזמנה {sortField === "created_at" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
            </th>
            <th>תאריך הגעה צפוי</th>
            <th onClick={() => handleSort("approval_rank")}>
  סטטוס {sortField === "approval_rank" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
</th>
<th onClick={() => handleSort("payment_status_rank")}>
  סטטוס תשלום {sortField === "payment_status_rank" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
</th>

            <th>סכום ששולם</th>
            <th>זמן אספקה צפוי</th>
          </tr>
        </thead>

        <tbody>
          {sortedOrders.map((order) => (

            <tr
              key={order.id}
              className={
               Number(order.price)  <= Number(order.amount_paid) 
                  ? "  paid"
                  : order.amount_paid > 0
                  ? "partially-paid"
                  : "unpaid"
              }
            >

              {console.log( Number(order.price)  >= Number(order.amount_paid) ,"------", order.price,"----",order.amount_paid)}
              <td>
                <Link to={`/order/${order.id}`}>{order.id}</Link>
              </td>
              <td>{order.provider_name}</td>
              <td>{order.price}</td>
              <td>{order.created_at?.split("T")[0]}</td>
              <td>
                {order.estimated_delivery_time
                  ? `זמן אספקה משוער: ${
                      Math.floor(
                        (new Date(order.estimated_delivery_time) -
                          new Date(order.created_at)) /
                          (1000 * 60 * 60 * 24)
                      )
                    } ימים`
                  : "לא צויין"}
              </td>
              <td>{order.is_approved === 0 ? "נשלח לספק" : "נקלט במלאי"}</td>
              <td>
                {Number(order.price) <= Number(order.amount_paid)
                  ? " שולם "
                  : order.amount_paid > 0
                  ? "שולם חלקית"
                  : " לא שולם"}
              </td>
              <td>
                <input
                  onChange={handlePaymentAmount}
                  type="text"
                  placeholder={order.amount_paid}
                />
                <button onClick={() => handlePaymentUpdate(order)}>שלח</button>
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
