
// import "../../css/order.css";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import axiosInstance from "../../config/AxiosConfig";
// import PrimaryButton from "../btn/PrimaryButton";

// function ProvidersOrders({ close, providersState }) {
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [cart, setCart] = useState([]); // מצב לעגלה

//   const dispatch = useDispatch();

//   const handleProviderClick = async (provider) => {
//     try {
//       setLoadingProducts(true);

//       // שליחה עם POST
//       const res = await axiosInstance.post(
//         `/providers/items`,
//         {
//           providerId: provider.id, // שולחים את ה-providerId בגוף הבקשה
//         },
//         {
//           withCredentials: true, // לשלוח את ה-cookies עם הבקשה
//         }
//       );

//       // עדכון הסטייט עם המידע שהתקבל
//       setProducts(res.data.items);
//       setSelectedCategory(provider);
//     } catch (err) {
//       // טיפול בשגיאות
//       dispatch({
//         type: "ERROR",
//         data: err.data.data.message || "שגיאה בטעינת המוצרים מהספק",
//       });
//       console.error(err);
//     } finally {
//       setLoadingProducts(false); // מפסיקים את טעינת המוצרים
//     }
//   };

//   const handleBack = () => {
//     setSelectedCategory(null);
//     setProducts([]);
//   };

//   const addToCart = (item, quantity) => {
//     setCart((prevCart) => [
//       ...prevCart,
//       { ...item, quantity: quantity },
//     ]);
//   };

//   const removeFromCart = (itemId) => {
//     setCart((prevCart) =>
//       prevCart.filter((item) => item.id !== itemId)
//     );
//   };

//   const sendOrder = async () => {
//     try {
//       const response = await axiosInstance.post("/order", cart, {
//         withCredentials: true,
//       });
//       console.log("ההזמנה נשלחה בהצלחה:", response.data);
//       // לנקות את העגלה אחרי שליחה
//       setCart([]);
//     } catch (err) {
//       console.error("שגיאה בשליחת ההזמנה:", err);
//     }
//   };

//   return (
//     <div className="popupOverlay">
//       <div className="popupContainer">
//         <br />
//         <br />
//         <button className="closeBtn" onClick={close}>
//           ✖
//         </button>

//         {!selectedCategory ? (
//           <>
//             <h2 className="popupTitle">בחר ספק</h2>
//             <div className="categoriesGrid">
//               {providersState.map((provider, index) => (
//                 <div
//                   key={index}
//                   className="categoryBox"
//                   onClick={() => handleProviderClick(provider)}
//                 >
//                   {provider.name}
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="popupHeader">
//               <button onClick={handleBack} className="backBtn">
//                 ⬅ חזרה
//               </button>
//               <h2 className="popupTitle">{selectedCategory.name}</h2>
//             </div>

//             {loadingProducts ? (
//               <p>טוען מוצרים...</p>
//             ) : (
//               <div className="productsGrid">
//                 {products.map((item, index) => (
//                   <div key={index} className="productCard">
//                     <h3>{item.name}</h3>
//                     <p>₪{item.price}</p>
//                     <div className="quantityControl">
//                       <button onClick={() => addToCart(item, 10)}>הוסף 10</button>
//                       <button onClick={() => addToCart(item, 100)}>הוסף 100</button>
//                       <button onClick={() => addToCart(item, 500)}>הוסף 500</button>
//                       <button onClick={() => removeFromCart(item.id)}>
//                         הסר 
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {cart.length > 0 && (
//           <div className="cartSummary">
//             <h3>העגלה שלך:</h3>
//             <ul>
//               {cart.map((item, i) => (
//                 <li key={i}>
//                   {item.name} - {item.quantity} יחידות
//                 </li>
//               ))}
//             </ul>
//             <PrimaryButton click={sendOrder} text="שלח הזמנה" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProvidersOrders;


import "../../css/order.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../config/AxiosConfig";
import PrimaryButton from "../btn/PrimaryButton";
import { ERROR } from "../../redux/contents/errContent";

function ProvidersOrders({ close, providersState }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [cart, setCart] = useState([]);

  const dispatch = useDispatch();

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
        type: "ERROR",
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
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  const decreaseQuantity = (itemId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const sendOrder = async () => {
    try {
      const response = await axiosInstance.post("/order", cart, {
        withCredentials: true,
      });
      console.log("ההזמנה נשלחה בהצלחה:", response.data);
      setCart([]);
    } catch (err) {
      dispatch({type:ERROR,data:{message:'לא שלח'}})
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

        {cart.length > 0 && (
          <div className="cartSummary">
            <h3>העגלה שלך:</h3>
            <ul>
              {cart.map((item, i) => (
                <li key={i}>
                  {item.name} - {item.quantity} יחידות
                </li>
              ))}
            </ul>
            <PrimaryButton click={sendOrder} text="שלח הזמנה" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProvidersOrders;
