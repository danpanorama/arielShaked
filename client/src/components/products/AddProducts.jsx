import { useState } from "react";
import "../../App.css";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";

function AddProduct(props) {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    min_required: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <h1 onClick={props.activePopUp}>X</h1>
      <h1>הוספת מוצר חדש</h1>

      <form>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">שם מוצר</label>
          <input className="SearchBar" type="text" name="name" value={productData.name} onChange={handleChange} />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">קטגוריה</label>
          <input className="SearchBar" type="text" name="category" value={productData.category} onChange={handleChange} />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות</label>
          <input className="SearchBar" type="number" name="quantity" value={productData.quantity} onChange={handleChange} />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">יחידת מידה</label>
          <input className="SearchBar" type="text" name="unit" value={productData.unit} onChange={handleChange} />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות מינימלית</label>
          <input className="SearchBar" type="number" name="min_required" value={productData.min_required} onChange={handleChange} />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">פעיל</label>
          <input type="checkbox" name="is_active" checked={productData.is_active} onChange={handleChange} />
        </div>

        <PrimaryButton text="שמירה" click={() => props.addProvider(productData)} />
      </form>
    </div>
  );
}

export default AddProduct;
