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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <CloseButton text={'X'}  click={props.activePopUp} />
      <h1>הוספת פריט חדש</h1>

      <form>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">שם מוצר</label>
          <input
            className="SearchBar"
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">קטגוריה</label>
          <select
            className="SearchBar"
            name="category"
            value={productData.category}
            onChange={handleChange}
          >
            <option value="">בחר קטגוריה</option>
          
            <option value=" קפואים"> קפואים</option>
            <option value="חומרי גלם">חומרי גלם </option>
            <option value=" יבשים"> יבשים </option>

            {/* תוכל להוסיף כאן עוד קטגוריות כרצונך */}
          </select>
        </div>

        {/* <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות</label>
          <input type="text"
            className="SearchBar"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
          />
          
        </div> */}

        <div className="inputHolderDiv marginBottom10">
          <label className="label">יחידת מידה</label>
          <select
            className="SearchBar"
            name="unit"
            value={productData.unit}
            onChange={handleChange}
          >
            <option value="">בחר יחידה</option>
            <option value="קילוגרם">קילוגרם</option>
            <option value="חבילה">חבילה</option>
            <option value="ליטר">ליטר</option>
            <option value="יחידה">יחידה</option>
            {/* תוכל להוסיף או לשנות לפי הצורך */}
          </select>
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות מינימלית נדרשת</label>
          <input
            className="SearchBar"
            type="number"
            name="min_required"
            value={productData.min_required}
            onChange={handleChange}
          />
        </div>
{/* 
        <div className="inputHolderDiv marginBottom10">
          <label className="label">פעיל</label>
          <input
            type="checkbox"
            name="is_active"
            checked={productData.is_active}
            onChange={handleChange}
          />
        </div> */}
<br />
        <PrimaryButton
          text="שמירה"
          click={() => props.addProvider(productData,setProductData)}
        />
      </form>
    </div>
  );
}

export default AddProduct;
