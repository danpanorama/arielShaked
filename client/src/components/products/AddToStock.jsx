import { useState } from "react";
import "../../App.css";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";

function AddToStock({ products, addStockToProduct, activePopUp }) {
  const [stockData, setStockData] = useState({
    productId: "",
    quantity: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    console.log('l')
    e.preventDefault();
    const { productId, quantity } = stockData;
    if (!productId || !quantity) return;

    addStockToProduct({
      productId,
      quantity: Number(stockData.quantity),
      reason: stockData.reason,
    });

    setStockData({
      productId: "",
      quantity: "",
      reason: "",
    });

    activePopUp(); // סגור את הפופאפ
  };

  return (
    <div className="yellowPopUp addProviderFrom">
<CloseButton text={'X'} click={activePopUp} />
      <h1>החזרת פריט למלאי</h1>

      <form onSubmit={handleSubmit}>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">בחר מוצר</label>
          <select
            className="SearchBar"
            name="productId"
            value={stockData.productId}
            onChange={handleChange}
            required
          >
            <option value="">-- בחר מוצר --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות להוספה</label>
          <input
            className="SearchBar"
            type="number"
            name="quantity"
            min="1"
            placeholder="לדוגמה: 50"
            value={stockData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">סיבת החזרה (אופציונלי)</label>
          <input
            className="SearchBar"
            type="text"
            name="reason"
            placeholder="לדוגמה: חזר מהספק"
            value={stockData.reason}
            onChange={handleChange}
          />
        </div>

        <PrimaryButton text="הוסף למלאי" click={handleSubmit} />
      </form>
    </div>
  );
}

export default AddToStock;
