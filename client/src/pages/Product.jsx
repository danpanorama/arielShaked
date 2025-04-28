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

function Product() {
  const dispatch = useDispatch();
  const [isPopUpActive, setIsPopUpActive] = useState(false);
  const [products, setProducts] = useState([]);
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
      const  data  = await axiosInstance.get("/products", {
        withCredentials: true,
      });
     
      if(data.error){
        return
      }

      setProducts(data.data[0]);
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
      const  data  = await axiosInstance.post("/products/addProduct", newProduct, {
        withCredentials: true,
      });
    
      setProducts((prev) => [...prev, data.data.product[0]]);
    } catch (e) {
      
      dispatch({
        type: ERROR,
        data: {
          message: e?.response.data.error || "שגיאה כללית בהוספת פריט",
          header:  "שגיאה בעת הוספת פריט חדש",
        },
      });
    }
  };

  const deleteProduct = async (id) => {
    try {
      
      

      await axiosInstance.post(`/products/removeProduct/`,id, {
        withCredentials: true,
      });


      setProducts((prev) => prev.filter((product) => product._id !== id));



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
 


  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="מלאי" />

      <div className="flex-row-bet">
        <SearchBar />
        <div className="flex-row-bet">
          <PrimaryButton click={((e)=>{togglePopUp('product')})} text="הכנסת פריט" />
          <PrimaryButton click={((e)=>{togglePopUp('removeProduct')})} text="הוצאת פריט" />
        </div>
      </div>

      <br />
      <br />

      <ProductsTable
        Products={products}
        onDelete={deleteProduct}
      />

      <PopUpGeneral
        type={popUpType}
        click={togglePopUp}
        deleteProduct={deleteProduct}
        isPopUpActive={isPopUpActive}
        addProvider={addProduct}
        activePopUp={togglePopUp}
      />
    </div>
  );
}

export default Product;
