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

  const [invalidFields, setInvalidFields] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const required = ["productId", "quantity"];
    const invalids = required.filter((field) => !stockData[field]?.toString().trim());
    setInvalidFields(invalids);
    return invalids.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    addStockToProduct({
      productId: stockData.productId,
      quantity: Number(stockData.quantity),
      reason: stockData.reason,
    });

    setStockData({
      productId: "",
      quantity: "",
      reason: "",
    });
    setInvalidFields([]);
    activePopUp(); // סגירת הפופאפ
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <CloseButton text={"X"} click={activePopUp} />
      <h1>הכנסת פריט למלאי</h1>

      <form onSubmit={handleSubmit}>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">בחר מוצר*</label>
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
            className={`SearchBar ${invalidFields.includes("productId") ? "input-error" : ""}`}
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                border: invalidFields.includes("productId") ? "1px solid red" : "none",
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
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות להוספה*</label>
          <input
            className={`SearchBar ${invalidFields.includes("quantity") ? "input-error" : ""}`}
            type="number"
            name="quantity"
            min="1"
            placeholder="לדוגמה: 50"
            value={stockData.quantity}
            onChange={handleChange}
          />
        </div>

        <PrimaryButton text="הכנסת פריט למלאי" click={handleSubmit} />
      </form>
    </div>
  );
}

export default AddToStock;
