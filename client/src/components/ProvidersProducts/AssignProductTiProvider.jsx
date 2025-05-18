import { useState, useEffect } from "react";
import "../../App.css";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";
import axiosInstance from "../../config/AxiosConfig";

function AssignProductTiProvider({ activePopUp, associateProductToProvider }) {
  const [formData, setFormData] = useState({
    item_number: "",
    provider_id: "",
    price: "",
    min_order_quantity: "",
  });

  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    getAllProducts();
    getAllProviders();
  }, []);

  async function getAllProducts() {
    try {
      const res = await axiosInstance.get("/products", {
        withCredentials: true,
      });
      setProducts(res.data[0]);
    } catch (err) {
      console.error("שגיאה בטעינת מוצרים", err);
    }
  }

  async function getAllProviders() {
    try {
      const res = await axiosInstance.get("/providers", {
        withCredentials: true,
      });
      setProviders(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת ספקים", err);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "provider_id") {
      const [id, nameValue] = value.split("|");
      setFormData((prev) => ({
        ...prev,
        provider_id: id,
        provider_name: nameValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <h1 onClick={activePopUp}>X</h1>
      <h1>שיוך מוצר לספק</h1>
      <form>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">מספר פריט</label>
          <select
            className="SearchBar"
            name="item_number"
            value={formData.item_number}
            onChange={handleChange}
          >
            <option value="">בחר פריט</option>

            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">מספר ספק</label>
          <select
            className="SearchBar"
            name="provider_id"
            value={formData.provider_id}
            onChange={handleChange}
          >
            <option value="">בחר ספק </option> 
            {providers.map((provider) => (
              <option  
                key={provider.id}
                value={provider.id}
              >
                {provider.id} - {provider.name}
              </option>
            ))}
          </select>
        </div> 

        <div className="inputHolderDiv marginBottom10">
          <label className="label">מחיר</label>
          <input
            className="SearchBar"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">  כמות מינימלית לאספקה</label>
          <input
            className="SearchBar"
            type="number"
            name="min_order_quantity"
            value={formData.min_order_quantity}
            onChange={handleChange}
          />
        </div>

        <PrimaryButton
          data={formData}
          click={associateProductToProvider}
          text="שמירה"
          type="submit"
        />
      </form>
    </div>
  );
}

export default AssignProductTiProvider;
