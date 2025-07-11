import React, { useState } from "react";
import axiosInstance from "../../config/AxiosConfig";
import { ERROR } from "../../redux/contents/errContent";
import { useNavigate } from "react-router-dom";

function OrderDetails({
  order,
  orderIndex,
  products,
  setFilteredProducts,
  setOriginalProducts,
  setSelectedOrderIndex,
  setPendingOrders,
  dispatch,
  setIsCustomPopUpActive,
}) {
  const [missingItemsPopup, setMissingItemsPopup] = useState(null);
const navigate = useNavigate();

  const handleQuantityChange = (itemIndex, value) => {
    setPendingOrders((prev) => {
      const updatedOrders = [...prev];
      updatedOrders[orderIndex].items[itemIndex].receivedQuantity =
        Number(value);
      return updatedOrders;
    });
  };

  const updateInventory = (formattedItems) => {
    console.log(formattedItems);
    setFilteredProducts((prev) =>
      prev.map((product) => {
        const matched = formattedItems.find(
          (item) => item.product_id === product.id
        );
        if (matched) {
          return {
            ...product,
            quantity: (
              parseFloat(product.quantity) + matched.receivedQuantity
            ).toFixed(2),
          };
        }
        return product;
      })
    );

    setOriginalProducts((prev) =>
      prev.map((product) => {
        const matched = formattedItems.find(
          (item) => item.product_id === product.id
        );
        if (matched) {
          return {
            ...product,
            quantity: (parseFloat(product.quantity) + matched.quantity).toFixed(
              2
            ),
          };
        }
        return product;
      })
    );
  };

  const handleSendConfirmation = async (formattedItems) => {
    try {
      await axiosInstance.post(
        "/providers/confirm",
        { orderId: order.id, items: formattedItems },
        { withCredentials: true }
      );
      console.log(formattedItems);

      updateInventory(formattedItems);
      setPendingOrders((prev) => prev.filter((o) => o.id !== order.id));
      setSelectedOrderIndex(null);
      setIsCustomPopUpActive(false);
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

  const confirmOrder = () => {
    const formattedItems = order.items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: Number(item.quantity),
      receivedQuantity: Number(item.receivedQuantity ?? item.quantity),
    }));

    const missingItems = formattedItems.filter(
      (item) => item.receivedQuantity < item.quantity
    );

    if (missingItems.length > 0) {
      setMissingItemsPopup(missingItems);
    } else {
      // שולח את כל הפריטים תמיד
      handleSendConfirmation(formattedItems);
    }
  };

  return (
    <div className="orderDetails">
      <button onClick={() => setSelectedOrderIndex(null)}>← חזור לרשימה</button>
      <h4>
        פירוט הזמנה #{order.id} - {order.providerName}
      </h4>

      <ul>
        {order.items.map((item, index) => (
          <li key={item.productId}>
            {item.product_name} - כמות שהוזמנה: {item.quantity} <br />
            <input
              type="number"
              min="0"
              value={item.receivedQuantity ?? item.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
            />{" "}
            ← כמות שהתקבלה
          </li>
        ))}
      </ul>

      <button className="confirmBtn" onClick={confirmOrder}>
        אשר קבלה
      </button>

      {missingItemsPopup && (
        <div className="popupContainer2">
          <div className="popupContent">
            <h3>שים לב, הזמנה סופקה באופן חלקי</h3>
            <ul>
              {missingItemsPopup.map((item) => (
                <li key={item.product_id}>
                  {item.product_name} - התקבל: {item.receivedQuantity ?? 0} מתוך{" "}
                  {item.quantity}
                </li>
              ))}
            </ul>
            <p>האם ברצונך ליצור הזמנה חדשה עבור פריטים חסרים?</p>

            {/* <button
              className="confirmBtn"
              onClick={() => {
                // במקום לשלוח רק missingItems, שולח את כל הפריטים עם הכמויות המלאות
                const formattedItems = order.items.map((item) => ({
                  product_id: item.product_id,
                  quantity: Number(item.receivedQuantity ?? item.quantity),
                }));

                handleSendConfirmation(formattedItems);
                setMissingItemsPopup(null);

                window.location.href = "/providersOrders"; // ניתן לשנות ל־navigate אם אתה עם React Router
              }}
            >
              כן
            </button> */}

            <button
              className="confirmBtn"
              onClick={() => {
                const formattedItems = order.items.map((item) => ({
                  product_id: item.product_id,
                  quantity: Number(item.quantity),
                  receivedQuantity: Number(
                    item.receivedQuantity ?? item.quantity
                  ),
                }));

                handleSendConfirmation(formattedItems).then(() => {
                  navigate("/providersOrders");
                });
              }}
            >
              כן
            </button>
{/* 
            <button
              className="logoutBtn"
              onClick={() => {
                // במקום לשלוח רק missingItems, שולח את כל הפריטים עם הכמויות המלאות
                const formattedItems = order.items.map((item) => ({
                  product_id: item.product_id,
                  quantity: Number(item.receivedQuantity ?? item.quantity),
                }));

                handleSendConfirmation(formattedItems);
                setMissingItemsPopup(null);
              }}
            >
              לא
            </button> */}


            <button
  className="logoutBtn"
  onClick={async () => {
     const formattedItems = order.items.map((item) => ({
                  product_id: item.product_id,
                  quantity: Number(item.quantity),
                  receivedQuantity: Number(
                    item.receivedQuantity ?? item.quantity
                  ),
                }));

    handleSendConfirmation(formattedItems);
    setMissingItemsPopup(null);

  }}
>
  לא
</button>









          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
