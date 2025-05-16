import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../App.css";
import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import "../css/products.css";
import PopUpGeneral from "../components/popup/PopUpGeneral";
import Headers from "../components/header/Headers";
import axiosInstance from "../config/AxiosConfig";
import { ERROR } from "../redux/contents/errContent";
import ProductsTable from "../components/tables/ProductsTable";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";
import NewPopUp from "../components/popup/NewPopUp";

function Product() {
  const dispatch = useDispatch();
  const [isPopUpActive, setIsPopUpActive] = useState(false);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [popUpType, setPopUpType] = useState('');

  const togglePopUp = (e) => {
    setPopUpType(e)
    setIsPopUpActive((prev) => !prev);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await axiosInstance.get("/products", {
        withCredentials: true,
      });

      if (data.error) return;

      const productsData = data.data[0];
      setOriginalProducts(productsData);
      setFilteredProducts(productsData);
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

  const addProduct = async (newProduct) => {
    try {
      const data = await axiosInstance.post("/products/addProduct", newProduct, {
        withCredentials: true,
      });

      const addedProduct = data.data.product[0];

      setOriginalProducts((prev) => [...prev, addedProduct]);
      setFilteredProducts((prev) => [...prev, addedProduct]);
      setIsPopUpActive(false)
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.error || "שגיאה כללית בהוספת פריט",
          header: "שגיאה בעת הוספת פריט חדש",
        },
      });
    }
  };
  const deleteProductCompletely = async (productId) => {
  try {
    await axiosInstance.post(`/products/delete/`,{id:productId} ,{
      withCredentials: true,
    });

    setOriginalProducts((prev) => prev.filter((p) => p.id !== productId));
    setFilteredProducts((prev) => prev.filter((p) => p.id !== productId));
  } catch (e) {
    dispatch({
      type: ERROR,
      data: {
        message: e?.response?.data?.message || "שגיאה במחיקת מוצר",
        header: "שגיאה",
      },
    });
  }
};


  const removeProduct = async ({ productId, quantity }) => {
  try {
    const response = await axiosInstance.post(
      `/products/removeProduct/`,
      { productId, quantity },
      { withCredentials: true }
    );

    const newQuantity = response.data.quantity;

    setOriginalProducts((prev) =>
      prev.map((product) => {
        if (product.id === Number(productId)) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
      
setIsPopUpActive(false)
    setFilteredProducts((prev) =>
      prev.map((product) => {
        console.log(product.id,productId)
        if (product.id === Number(productId)) {
          console.log('here')
          return { ...product, quantity: newQuantity };
        }
        
        return product;
      })
    );
  } catch (e) {
    dispatch({
      type: ERROR,
      data: {
        message: e?.response?.data?.message || "שגיאה כללית במחיקת פריט",
        header: "שגיאה בעת מחיקת פריט",
      },
    });
  }
};
  

  const handleSearch = (searchTerm) => {
    const filtered = filterBySearchTerm(originalProducts, searchTerm, ["name", "id", "price"]);
    setFilteredProducts(filtered);
  };
  
  const addStockToProduct = async ({ productId, quantity, reason }) => {
  try {
    const response = await axiosInstance.post(
      "/products/addStock",
      {
        productId,
        quantity,
        reason,
      },
      { withCredentials: true }
    );

    const updatedProduct = response.data.product[0];

    // עדכון סטייטים מקומיים
    setOriginalProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    
    setFilteredProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  } catch (e) {
    dispatch({
      type: ERROR,
      data: {
        message: e?.response?.data?.error || "שגיאה בהחזרת מוצר למלאי",
        header: "שגיאה",
      },
    });
  }
};



  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="מלאי" />
      <div className="flex-row-bet">
        <SearchBar onSearch={handleSearch} />
        <div className="flex-row-bet">
          <PrimaryButton click={() => togglePopUp('product')} text="הכנסת פריט חדש" />
          <PrimaryButton click={() => togglePopUp('addStock')} text="החזרת פריט למלאי" />
          <PrimaryButton click={() => togglePopUp('removeProduct')} text="הוצאת פריט מהמלאי" />
          <PrimaryButton click={() => togglePopUp('receiveOrder')} text=" קבלת הזמנה" />

        </div>
      </div>

      <br />
      <br />

      <ProductsTable
        Products={filteredProducts}
        deleteProductCompletely={deleteProductCompletely}
      />

      <PopUpGeneral
        type={popUpType}
        click={togglePopUp}
        removeProduct={removeProduct}
        addStockToProduct={addStockToProduct}
        isPopUpActive={isPopUpActive}
        addProvider={addProduct}
        activePopUp={togglePopUp}
        products={filteredProducts}
      />
    </div>
  );
}
export default Product;
