import React, { useEffect, useState } from "react";
import "../../css/popup.css";
import axiosInstance from "../../config/AxiosConfig";
import { useDispatch } from "react-redux";
import { ERROR } from "../../redux/contents/errContent";

function ReceiveOrderPopup({ activePopUp }) {
  const dispatch = useDispatch();
  const [pendingOrders, setPendingOrders] = useState([]);

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
const handleQuantityChange = (orderIndex, itemIndex, value, items) => {
  console.log(orderIndex, itemIndex, value, items)
  const updatedOrders = [...pendingOrders];
  updatedOrders[orderIndex].items[itemIndex].receivedQuantity = Number(value);

  console.log(updatedOrders)
  setPendingOrders(updatedOrders);
};
const confirmOrder = async (orderId, items) => {
  try {
    const formattedItems = items.map((item) => ({
      product_id: item.product_id, // שימוש ב- product_id
      quantity: Number(item.receivedQuantity ?? item.quantity), // עדכון כמות שהתקבלה
    }));

    

    // קריאה לשרת לעדכון המלאי
    await axiosInstance.post(
      "/providers/confirm",
      { orderId, items: formattedItems },
      { withCredentials: true } // אם נדרש אישור משתמש
    );

    // הסרת ההזמנה המאושרת מהתצוגה
    setPendingOrders((prev) => prev.filter((order) => order.id !== orderId));
  } catch (e) {
    dispatch({
      type: ERROR,
      data: {
        message: e?.response?.data?.message || "שגיאה באישור ההזמנה",
        header: "שגיאה",
      },
    });
  }
};



  return (
    <div className="popupContainer2">
      <button className="closeBtn5" onClick={activePopUp}>
     X   
      </button>
      <br />
      <br />
      <div className="popupContent">
        <h2>הזמנות נכנסות</h2>

        {pendingOrders.length === 0 ? (
          <p>אין הזמנות להצגה</p>
        ) : (
          pendingOrders.map((order, orderIndex) => (
            <div key={order.id} className="orderItem">
              <h4>שם ספק: {order.providerName}</h4>
              <ul>
                {order.items.map((item, itemIndex) => (
                  <li key={item.productId}>
                    {item.product_name} - כמות שהוזמנה: {item.quantity} <br />
                    <input
                      type="number"
                      min="0"
                      value={item.receivedQuantity || item.quantity} // עדכון השדה עם הכמות החדשה
                      onChange={
                        (e) =>
                          handleQuantityChange(
                            orderIndex,
                            itemIndex,
                            e.target.value,
                            order.items
                          ) // שמירה של הערך החדש במצב
                      }
                    />{" "}
                    ← כמות שהתקבלה
                  </li>
                ))}
              </ul>
              <button
                className="confirmBtn"
                onClick={() => confirmOrder(order.id, order.items)}
              >
                אשר קבלה
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReceiveOrderPopup;
