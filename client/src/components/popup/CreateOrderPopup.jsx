import { useState } from "react";
import "../../css/order.css";
import "../../css/popup.css";
import "../../css/cart.css";
import PrimaryButton from "../btn/PrimaryButton";
import SearchBar from "../searchbar/SearchBar";

function CreateOrderPopup({
  close,
  providersList,
  setOrders,
  selectedProvider,
  setSelectedProvider,
  fetchProducts,
  loadingProducts,
  products,
  currentCart,
  addToCart,
  removeFromCart,
  showCart,
  setShowCart,
  sendOrder,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  // מחזיק כמות זמנית לכל מוצר, לפי id
  const [quantities, setQuantities] = useState({});

  const filteredProviders = providersList.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityInputChange = (itemId, value) => {
    // אפשר רק מספרים חיוביים או ריק (למחוק ולהקליד מחדש)
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setQuantities((prev) => ({ ...prev, [itemId]: value }));
    }
  };

  return (
    <div className="popupOverlay">
      <div className="popupContainer">
        <button className="closeBtn" onClick={close}>
          ✖
        </button>

        {!selectedProvider ? (
          <>
            <h2 className="popupTitle">בחר ספק</h2>
            <SearchBar onSearch={setSearchTerm} />

            <br />
            <div className="categoriesGrid">
              {filteredProviders.map((provider, idx) => (
                <div
                  key={idx}
                  className="categoryBox"
                  onClick={() => fetchProducts(provider)}
                >
                  {provider.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="popupHeader">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setQuantities({});
                }}
                className="backBtn"
              >
                ⬅ חזרה
              </button>
              <h2 className="popupTitle">{selectedProvider.name}</h2>
            </div>

            {loadingProducts ? (
              <p>טוען מוצרים...</p>
            ) : (
              <div className="productsGrid">
                {products.map((item, idx) => {
                  const cartItem =
                    currentCart?.items.find((i) => i.id === item.id) || null;

                  return (
                    <div key={idx} className="productCard">
                      <h3>{item.name}</h3>
                      <p>₪{item.price}</p>
                      <div className="quantityControl">
                        <input
                          type="number"
                          min="1"
                          placeholder="כמות"
                          value={quantities[item.id] || ""}
                          onChange={(e) =>
                            // אם המוצר עדיין לא בעגלה - אפשר להקליד כמות
                            cartItem
                              ? null
                              : handleQuantityInputChange(item.id, e.target.value)
                          }
                          disabled={!!cartItem} // אם המוצר בעגלה, לא ניתן לשנות את הכמות כאן
                        />

                        <button
                          onClick={() => {
                            // כמות להצבה - אם ריק או לא תקין, 1
                            let qty =
                              parseInt(quantities[item.id]) > 0
                                ? parseInt(quantities[item.id])
                                : 1;
                            addToCart(item, qty);
                            setQuantities((prev) => ({ ...prev, [item.id]: "" }));
                          }}
                        >
                          הוסף
                        </button>

                        <button onClick={() => removeFromCart(item)}>הסר</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentCart && currentCart.items.length > 0 && (
              <>
                <button
                  onClick={() => setShowCart(true)}
                  className="viewCartBtn"
                >
                  הצג עגלה ({currentCart.items.length})
                </button>

                {showCart && (
                  <div className="cartPopup">
                    <div className="cartContent">
                      <button
                        className="closeBtn"
                        onClick={() => setShowCart(false)}
                      >
                        ✖
                      </button>
                      <h3>העגלה שלך:</h3>
                      <div>
                        <h4>{selectedProvider.name}</h4>
                        <ul>
                          {currentCart.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} -{" "}
                              {isNaN(item.quantity) ? 0 : item.quantity} יחידות
                            </li>
                          ))}
                        </ul>
                      </div>
                      <PrimaryButton click={sendOrder} text="שלח הזמנה" />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CreateOrderPopup;
