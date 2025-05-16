import { useEffect, useState } from "react";
import "../../App.css";
import { useDispatch } from "react-redux";
import axiosInstance from "../../config/AxiosConfig";

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
        <CloseButton text={'X'} click={props.activePopUp} />
      <h1>הסרת פריט מהמלאי</h1>

      <form>
        {/* בחירת מוצר */}
        <div className="inputHolderDiv marginBottom10">
          <label className="label">בחר מוצר להסרה</label>
          <select
            className="SearchBar"
            name="productId"
            value={productData.productId}
            onChange={handleChange}
          >
            <option value="">בחר מוצר</option>
            {product?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
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
            <option value="נגנב">נגנב</option>
            <option value="עבר תוקף">עבר תוקף</option>
            <option value="אחר">אחר</option>
          </select>
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

        <PrimaryButton type="removeProduct" text="הסר" click={handleRemove} />
      </form>
    </div>
  );
}

export default RemoveProduct;
