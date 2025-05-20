import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../App.css";
import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import ProvidersProductTable from "../components/tables/ProvidersProductTable";
import "../css/providers.css";
import PopUpGeneral from "../components/popup/PopUpGeneral";
import Headers from "../components/header/Headers";
import axiosInstance from "../config/AxiosConfig";
import { ERROR } from "../redux/contents/errContent";
import { getFromServer } from "../components/tools/FetchData";
import IconPlus from '../images/plus.svg'
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";

function ProvidersProducts() {
  const dispatch = useDispatch();
  const [activePopUp, setActivePopUp] = useState(false);
  const [providersProductArray, setProvidersProductArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const activePopUpFunction = () => {
    setActivePopUp(!activePopUp);
  };

  useEffect(() => {
    getFromServer(
      "/providersProducts",
      setProvidersProductArray,
      "אירעה שגיאה",
      "שגיאה",
      dispatch
    );
  }, []);

  const filteredProducts = filterBySearchTerm(providersProductArray, searchTerm, [
    "provider_name",
    "item_number",
    "name",
  ]);

  async function associateProductToProvider(formData,clearData) {
    try { 
      const {
        provider_name,
        item_number, 
        provider_id,
        price,
        min_order_quantity,
      } = formData;
      if(price <= 0 || min_order_quantity <=0 ){
     return dispatch({type:ERROR,data:{message:'למלא את כל המידע '}})
      }

      const response = await axiosInstance.post( 
        "/providersProducts/assignProduct",
        {
          provider_name,
          item_number,
          provider_id,
          price,
          min_order_quantity,
        },
        {
          withCredentials: true,
        }
      );

    
      setActivePopUp(false)
      console.log(response.data)
     setProvidersProductArray((prev) => [...prev, response.data.obj]);
      setSearchTerm("");
      clearData({    item_number: "",
    provider_id: "",
    price: "",
    min_order_quantity: "",}) //
     
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בעת שיוך מוצר לספק",
          header: "שגיאה בשיוך",
        },
      });
    }
  }

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="שיוך מוצרים לספקים" />
      <div className="flex-row-bet">
        <SearchBar onSearch={(value) => setSearchTerm(value)} />
        <PrimaryButton icon={IconPlus} click={activePopUpFunction} text="הוספת שיוך לספק" />
      </div>
      <br />
      <br />
      <ProvidersProductTable providersProductArray={filteredProducts } />
      <PopUpGeneral
        click={associateProductToProvider}
        isPopUpActive={activePopUp}
        activePopUp={activePopUpFunction}
        associateProductToProvider={associateProductToProvider}
        type="provider-products"
      />
    </div>
  );
}

export default ProvidersProducts;
