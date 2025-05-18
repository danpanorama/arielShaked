import { useState } from "react";
import "../../App.css";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";
import Select from "react-select";
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
      <h1>  הכנסת פריט למלאי</h1>

      <form onSubmit={handleSubmit}>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">בחר מוצר</label>
          {/* <select
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
          </select> */}
<Select
  name="productId"
  options={products.map((p) => ({ value: p.id, label: p.name }))}
  value={
    products
      .map((p) => ({ value: p.id, label: p.name }))
      .find((option) => option.value === stockData.productId) || null
  }
  onChange={(selectedOption) => {
    handleChange({
      target: {
        name: "productId",
        value: selectedOption?.value || "",
      },
    });
  }}
  placeholder="בחר מוצר"
  className="SearchBar"
  classNamePrefix=""
  styles={{
    control: (base) => ({
      ...base,
      border: "none",
      outline: "none",
      overflow: "hidden",
      boxShadow: "none",
      borderRadius: "30px",
      backgroundColor: "#f9f9f9",
      fontSize: "1.2rem",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#999",
    }),
  }}
  isClearable
/>



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

      

        <PrimaryButton text=" הכנסת פריט למלאי" click={handleSubmit} />
      </form>
    </div>
  );
}

export default AddToStock;
