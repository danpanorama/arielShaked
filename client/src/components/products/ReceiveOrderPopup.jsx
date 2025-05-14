import React from "react";
import "../../css/popup.css";

function ReceiveOrderPopup({ activePopUp, orders }) {
  return (
    <div className="popupContainer">
      <div className="popupContent">
        <h2>הזמנות נכנסות</h2>
        {orders.length === 0 ? (
          <p>אין הזמנות להצגה</p>
        ) : (
          orders.map((order, idx) => (
            <div key={idx} className="orderItem">
              <h4>שם ספק: {order.providerName}</h4>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} - כמות: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
        <button className="closeBtn" onClick={activePopUp}>
          סגור
        </button>
      </div>
    </div>
  );
}

export default ReceiveOrderPopup;
