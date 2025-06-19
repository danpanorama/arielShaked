import "../../css/order.css";
import "../../css/popup.css";
import "../../css/cart.css";
import { useState, useEffect } from "react";
import CartSidebar from "../cart/CartSidebar";
import SearchBar from "../searchbar/SearchBar";

function OrderPopUp({
  close,
  products,
  getCategoryProducts,
  categoryProducts,
  cart,
  addToCart,
  removeFromCart,
  handleSendOrder
}) {
  const [quantities, setQuantities] = useState({});

  // סטייט לרשימת מוצרים מסוננת
  const [filteredProducts, setFilteredProducts] = useState(categoryProducts);

  // כל פעם ש-categoryProducts מתעדכנת, מאתחלים את ה-filteredProducts
  useEffect(() => {
    setFilteredProducts(categoryProducts);
  }, [categoryProducts]);

  const handleQuantityChange = (id, value) => {
    const parsedValue = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(parsedValue) ? "" : parsedValue,
    }));
  };

  const handleAddToCart = (product) => {
    const quantityToAdd = quantities[product.id];
    const parsedQuantity = parseInt(quantityToAdd, 10);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert("יש להזין כמות תקינה");
      return;
    }

    if (parsedQuantity > product.quantity) {
      alert(`לא ניתן להזמין יותר מ-${product.quantity} יחידות`);
      return;
    }

    addToCart(product, parsedQuantity);
  };

  // פונקציה פשוטה לסינון לפי שם מוצר
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProducts(categoryProducts);
      return;
    }
    const filtered = categoryProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="popupOverlay">
      <div className="popupContainer">
        <SearchBar onSearch={handleSearch} />
        <br />
        {filteredProducts.length > 0 ? (
          <div className="productsGrid">
            {filteredProducts.map((product) => {
              const quantity =
                cart.find((item) => item.id === product.id)?.quantity || 0;
              return (
                <div key={product.id} className="productCard">
                  <h3>{product.name}</h3>
                  <p>
                    כמות זמינה: {product.quantity} {product.unit}
                  </p>

                  <div className="orderPopup-actions">
                    <input
                      type="number"
                      className="orderPopup-quantityInput"
                      placeholder="הכנס כמות"
                      min="0"
                      max={product.quantity}
                      value={quantities[product.id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                    />

                    <button
                      className="orderPopup-addBtn"
                      onClick={() => handleAddToCart(product)}
                    >
                      הוסף לעגלה
                    </button>
                    <button
                      className="orderPopup-removeBtn"
                      onClick={() => removeFromCart(product.id)}
                    >
                      הסר מהעגלה
                    </button>
                    {quantity > 0 && (
                      <div className="orderPopup-inCart">בעגלה: {quantity}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>לא נמצאו מוצרים התואמים לחיפוש</p>
        )}
        <CartSidebar handleSendOrder={handleSendOrder} cart={cart} />

        <button className="orderCartSubmitBtn" onClick={handleSendOrder}>
          אישור
        </button>
      </div>
    </div>
  );
}

export default OrderPopUp;
