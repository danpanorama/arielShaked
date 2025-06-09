import { useState } from "react";
import "../../App.css";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";

function AddProduct(props) {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    min_required: "",
    is_active: true,
  });

  const [invalidFields, setInvalidFields] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateFields = () => {
    const required = ["name", "category", "unit", "min_required"];
    const invalids = required.filter(
      (field) => !productData[field]?.toString().trim()
    );
    setInvalidFields(invalids);
    return invalids.length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;
    props.addProvider(productData, setProductData);
    setInvalidFields([]);
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <CloseButton text={"X"} click={props.activePopUp} />
      <h1>הוספת פריט חדש</h1>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">שם מוצר*</label>
          <input
            className={`SearchBar ${invalidFields.includes("name") ? "input-error" : ""}`}
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">קטגוריה*</label>
          <select
            className={`SearchBar ${invalidFields.includes("category") ? "input-error" : ""}`}
            name="category"
            value={productData.category}
            onChange={handleChange}
          >
            <option value="">בחר קטגוריה</option>
            <option value="קפואים">קפואים</option>
            <option value="חומרי גלם">חומרי גלם</option>
            <option value="יבשים">יבשים</option>
          </select>
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">יחידת מידה*</label>
          <select
            className={`SearchBar ${invalidFields.includes("unit") ? "input-error" : ""}`}
            name="unit"
            value={productData.unit}
            onChange={handleChange}
          >
            <option value="">בחר יחידה</option>
            <option value="קילוגרם">קילוגרם</option>
            <option value="חבילה">חבילה</option>
            <option value="ליטר">ליטר</option>
            <option value="יחידה">יחידה</option>
          </select>
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות מינימלית נדרשת*</label>
          <input
            className={`SearchBar ${invalidFields.includes("min_required") ? "input-error" : ""}`}
            type="number"
            name="min_required"
            value={productData.min_required}
            onChange={handleChange}
          />
        </div>

        {/* <div className="inputHolderDiv marginBottom10">
          <label className="label">פעיל</label>
          <input
            type="checkbox"
            name="is_active"
            checked={productData.is_active}
            onChange={handleChange}
          />
        </div> */}

        <br />
        <PrimaryButton text="שמירה" click={handleSubmit} />
      </form>
    </div>
  );
}

export default AddProduct;
