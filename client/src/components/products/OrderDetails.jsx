import React from "react";
import axiosInstance from "../../config/AxiosConfig";
import { ERROR } from "../../redux/contents/errContent";

function OrderDetails({
  order,
  orderIndex,
  products,
  setFilteredProducts,
  setSelectedOrderIndex,
  setOriginalProducts,
  setPendingOrders,
  dispatch
}) {
  const handleQuantityChange = (itemIndex, value) => {
    setPendingOrders(prev => {
      const updatedOrders = [...prev];
      updatedOrders[orderIndex].items[itemIndex].receivedQuantity = Number(value);
      return updatedOrders;
    });
  };

  const confirmOrder = async () => {
    try {
      const formattedItems = order.items.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.receivedQuantity ?? item.quantity),
      }));

      await axiosInstance.post(
        "/providers/confirm",
        { orderId: order.id, items: formattedItems },
        { withCredentials: true }
      );

      
    // עדכון המלאי של המוצרים אחרי אישור ההזמנה
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) => { 
        const matchedItem = formattedItems.find(
          (item) => item.product_id === product.id
        );

        if (matchedItem) {
          return {
            ...product,
            quantity: (
              parseFloat(product.quantity) + matchedItem.quantity
            ).toFixed(2),
          };
        }
        return product;
      })
    );


        // עדכון המלאי של המוצרים אחרי אישור ההזמנה
    setOriginalProducts((prevProducts) =>
      prevProducts.map((product) => { 
        const matchedItem = formattedItems.find(
          (item) => item.product_id === product.id
        );

        if (matchedItem) {
          return {
            ...product,
            quantity: (
              parseFloat(product.quantity) + matchedItem.quantity
            ).toFixed(2),
          };
        }
        return product;
      })
    );

      setPendingOrders(prev => prev.filter((o) => o.id !== order.id));
   


      
      setSelectedOrderIndex(null);
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
    <div className="orderDetails">
      <button onClick={() => setSelectedOrderIndex(null)}>← חזור לרשימה</button>
      <h4>פירוט הזמנה #{order.id} - {order.providerName}</h4>
      <ul>
        {order.items.map((item, index) => (
          <li key={item.productId}>
            {item.product_name} - כמות שהוזמנה: {item.quantity} <br />
            <input
              type="number"
              min="0"
              value={item.receivedQuantity ?? item.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
            /> ← כמות שהתקבלה
          </li>
        ))}
      </ul>
      <button className="confirmBtn" onClick={confirmOrder}>
        אשר קבלה
      </button>
    </div>
  );
}

export default OrderDetails;
