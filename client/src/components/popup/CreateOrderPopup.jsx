import "../../css/order.css";
import "../../css/popup.css";
import "../../css/cart.css";
import PrimaryButton from "../btn/PrimaryButton";

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
  handleQuantityChange,
  showCart,
  setShowCart,
  sendOrder,
}) {
  return (
    <div className="popupOverlay">
      <div className="popupContainer">
        <button className="closeBtn" onClick={close}>✖</button>

        {!selectedProvider ? (
          <>
            <h2 className="popupTitle">בחר ספק</h2>
            <div className="categoriesGrid">
              {providersList.map((provider, idx) => (
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
              <button onClick={() => { setSelectedProvider(null); }} className="backBtn">⬅ חזרה</button>
              <h2 className="popupTitle">{selectedProvider.name}</h2>
            </div>

            {loadingProducts ? (
              <p>טוען מוצרים...</p>
            ) : (
              <div className="productsGrid">
                {products.map((item, idx) => (
                  <div key={idx} className="productCard">
                    <h3>{item.name}</h3>
                    <p>₪{item.price}</p>
                    <div className="quantityControl">
                      <input
                        type="number"
                        min="1"
                        defaultValue={1}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      />
                      <button onClick={() => addToCart(item, 1)}>הוסף</button>
                      <button onClick={() => removeFromCart(item)}>הסר</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentCart && currentCart.items.length > 0 && (
              <>
                <button onClick={() => setShowCart(true)} className="viewCartBtn">
                  הצג עגלה ({currentCart.items.length})
                </button>

                {showCart && (
                  <div className="cartPopup">
                    <div className="cartContent">
                      <button className="closeBtn" onClick={() => setShowCart(false)}>✖</button>
                      <h3>העגלה שלך:</h3>
                      <div>
                        <h4>{selectedProvider.name}</h4>
                        <ul>
                          {currentCart.items.map((item, idx) => (
                            <li key={idx}>{item.name} - {item.quantity} יחידות</li>
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
