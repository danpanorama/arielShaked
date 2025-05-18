import { useEffect, useState } from "react";
import "../../css/order.css";
import "../../css/popup.css";
import "../../css/cart.css";
import PrimaryButton from "../btn/PrimaryButton";
import SearchBar from "../searchbar/SearchBar";
import { filterBySearchTerm } from "../tools/filterBySearchTerm";

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
const [quantities, setQuantities] = useState({});

  const [filteredProducts, setFilteredProducts] = useState([]);

  const filteredProviders = providersList.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 const handleQuantityInputChange = (id, value) => {
  const parsed = parseInt(value);
  setQuantities((prev) => ({
    ...prev,
    [id]: isNaN(parsed) || parsed < 1 ? 1 : parsed,
  }));
};


  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  const handleProductSearch = (term) => {
    const filtered = filterBySearchTerm(products, term, [
      "name",
      "id",
      "description",
    ]); // או איזה שדות שתרצה
    setFilteredProducts(filtered);
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
                  setQuantities(0);
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
              <div className="">
                <SearchBar onSearch={handleProductSearch} />

                <div className="productsGrid">
                  {filteredProducts.map((item, idx) => {
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
  value={quantities[item.id] || 1}
  onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
/>



                          <button
                            onClick={() => {
                              // כמות להצבה - אם ריק או לא תקין, 1
                              const qty = parseInt(quantities[item.id]) > 0 ? parseInt(quantities[item.id]) : 1;
addToCart(item, qty);

                            }}
                          >
                            הוסף
                          </button>

                          <button onClick={() => removeFromCart(item)}>
                            הסר
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <>
              <div className="cartHolder">
                <div className="cartPopup">
                  <div className="cartContent">
                    <h3>העגלה שלך:</h3>
                    <div>
                      <h4>{selectedProvider.name}</h4>
                      <ul>
                        {currentCart?.items.map((item, idx) => (
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
              </div>
            </>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateOrderPopup;
