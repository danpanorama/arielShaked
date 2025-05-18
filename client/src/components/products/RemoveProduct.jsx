import { useEffect, useState } from "react";
import "../../App.css";
import { useDispatch } from "react-redux";
import axiosInstance from "../../config/AxiosConfig";
import Select from "react-select";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";
import { ERROR } from "../../redux/contents/errContent";
import CloseButton from "../btn/CloseButton";

function RemoveProduct(props) {
  const [product, setProduct] = useState([]);
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    productId: "",
    reason: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemove = () => {
    const { productId, reason, quantity } = productData;
    if (!productId || !reason || !quantity) {
      alert("אנא מלא את כל השדות.");
      return;
    }
    setProductData({ productId: "", reason: "", quantity: "" });
    props.removeProduct(productData);
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const getAllProduct = async () => {
    try {
      const data = await axiosInstance.get("/products", {
        withCredentials: true,
      });

      if (data.error) {
        return;
      }

      setProduct(data.data[0]);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "התרחשה שגיאה בעת שליפת המלאי",
          header: "שגיאה בטעינת פריטים",
        },
      });
    }
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <CloseButton text={"X"} click={props.activePopUp} />
      <h1>הוצאת פריט מהמלאי</h1>

      <form>
        {/* בחירת מוצר */}
        <div className="inputHolderDiv marginBottom10">
          <label className="label"> שם</label>

          <Select
            name="productId"
            options={product.map((p) => ({ value: p.id, label: p.name }))}
            onChange={(selectedOption) => {
              setProductData((prev) => ({
                ...prev,
                productId: selectedOption?.value || "",
              }));
            }}
            placeholder="בחר מוצר"
            className="SearchBar"
            classNamePrefix="" // מבטל את ה-prefix שמוסיף classים מיוחדים
            styles={{
              control: (base, state) => ({
                ...base,
                border: "none",
                outline: "none",
                overflow: "hidden",
                boxShadow: "none",
                borderRadius: "30px",
                "&:hover": {
                  border: "none",
                },
              }),
            }}
            isClearable
          />
        </div>
        {/* כמות */}
        <div className="inputHolderDiv marginBottom10">
          <label className="label">כמות</label>
          <input
            className="SearchBar"
            type="number"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            min="1"
          />
        </div>

        {/* סיבת הוצאה */}
        <div className="inputHolderDiv marginBottom10">
          <label className="label">סיבת הוצאה</label>
          <select
            className="SearchBar"
            name="reason"
            value={productData.reason}
            onChange={handleChange}
          >
            <option value="">בחר סיבה</option>
            <option value="מקולקל">מקולקל</option>

            <option value="אחר">שימוש בחנות </option>
          </select>
        </div>

        <PrimaryButton type="removeProduct" text="הסר" click={handleRemove} />
      </form>
    </div>
  );
}

export default RemoveProduct;
