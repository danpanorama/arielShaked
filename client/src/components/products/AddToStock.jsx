import { useState } from "react";
import "../../css/products.css";

function AddToStock({ products, addStockToProduct, activePopUp }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantity) return;

    addStockToProduct({
      productId: selectedProduct,
      quantity: Number(quantity),
      reason,
    });

    setSelectedProduct("");
    setQuantity("");
    setReason("");
    activePopUp(); // סגור את הפופאפ
  };

  return (
    <div className="add-stock-wrapper">
      <button className="close-button" onClick={activePopUp}>✕</button> 

      <form className="add-stock-form" onSubmit={handleSubmit}>
        <h2>הוספת מוצר למלאי</h2>

        <label htmlFor="product-select">בחר מוצר:</label>
        <select
          id="product-select"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">-- בחר מוצר --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <label htmlFor="quantity">כמות להוספה:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          placeholder="לדוגמה: 50"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <label htmlFor="reason">סיבת החזרה (אופציונלי):</label>
        <input
          type="text"
          id="reason"
          placeholder="לדוגמה: חזר מהספק"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button type="submit" className="add-btn">הוסף למלאי</button>
      </form>
    </div>
  );
}

export default AddToStock;
