import "../../css/order.css";
import "../../css/popup.css";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/AxiosConfig";
import PrimaryButton from "../btn/PrimaryButton";
import { ERROR } from "../../redux/contents/errContent";

function ProvidersOrders({ close, providersState,setOrders  }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.providerCart.items);
  const cartTotal = useSelector((state) => state.providerCart.total);

  const handleProviderClick = async (provider) => {
    try {
      setLoadingProducts(true);
      const res = await axiosInstance.post(
        `/providers/items`,
        { providerId: provider.id },
        { withCredentials: true }
      );
      setProducts(res.data.items);
      setSelectedCategory(provider);
    } catch (err) {
      dispatch({
        type: ERROR,
        data: err?.response?.data?.message || "שגיאה בטעינת המוצרים מהספק",
      });
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setProducts([]);
  };

  const addToCart = (item, quantity) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity, price: item.price * quantity },
    });
  };

  const decreaseQuantity = (itemId, amount) => {
    dispatch({
      type: "DECREASE_ITEM",
      payload: { id: itemId, amount },
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { id: itemId },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

const sendOrder = async () => {
  try {
    console.log(cartItems); // הצגת המוצרים שבעגלה
    const response = await axiosInstance.post("/providers/providersOrders", cartItems, {
      withCredentials: true,
    });
    console.log("ההזמנה נשלחה בהצלחה:", response.data);

    // עדכון הסטייט של ההזמנות (הוספת ההזמנה החדשה)
    setOrders((prevOrders) => [
      ...prevOrders,
      { ...response.data, status: "חדש", date: new Date() }, // הוסף את הנתונים שהחזרת מהשרת
    ]);
    
    clearCart(); // ריקון העגלה לאחר שליחה
  } catch (err) {
    dispatch({ type: ERROR, data: { message: "לא שלח" } });
    console.error("שגיאה בשליחת ההזמנה:", err);
  }
};



  return (
    <div className="popupOverlay">
      <div className="popupContainer">
        <br />
        <br />
        <button className="closeBtn" onClick={close}>
          ✖
        </button>

        {!selectedCategory ? (
          <>
            <h2 className="popupTitle">בחר ספק</h2>
            <div className="categoriesGrid">
              {providersState.map((provider, index) => (
                <div
                  key={index}
                  className="categoryBox"
                  onClick={() => handleProviderClick(provider)}
                >
                  {provider.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="popupHeader">
              <button onClick={handleBack} className="backBtn">
                ⬅ חזרה
              </button>
              <h2 className="popupTitle">{selectedCategory.name}</h2>
            </div>

            {loadingProducts ? (
              <p>טוען מוצרים...</p>
            ) : (
              <div className="productsGrid">
                {products.map((item, index) => (
                  <div key={index} className="productCard">
                    <h3>{item.name}</h3>
                    <p>₪{item.price}</p>
                    <div className="quantityControl">
                      <button onClick={() => addToCart(item, 10)}>הוסף 10</button>
                      <button onClick={() => addToCart(item, 100)}>הוסף 100</button>
                      <button onClick={() => addToCart(item, 500)}>הוסף 500</button>
                      <button onClick={() => decreaseQuantity(item.id, 10)}>
                        הורד 10
                      </button>
                      <button onClick={() => removeFromCart(item.id)}>
                        הסר מוצר
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {cartItems.length > 0 && (
          <>
            <button onClick={() => setShowCartPopup(true)} className="viewCartBtn">
              הצג עגלה ({cartItems.length})
            </button>
            {showCartPopup && (
              <div className="cartPopup">
                <div className="cartContent">
                  <button className="closeBtn" onClick={() => setShowCartPopup(false)}>
                    ✖
                  </button>
                  <h3>העגלה שלך:</h3>
                  <ul>
                    {cartItems.map((item, i) => (
                      <li key={i}>
                        {item.name} - {item.quantity} יחידות
                      </li>
                    ))}
                  </ul>
                  <p>סה"כ: ₪{cartTotal}</p>
                  <PrimaryButton click={sendOrder} text="שלח הזמנה" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProvidersOrders;
