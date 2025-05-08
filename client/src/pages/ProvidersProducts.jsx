



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

  async function associateProductToProvider(formData) {
    try {
      const {
        provider_name,
        item_number,
        provider_id,
        price,
        estimated_delivery_time,
        min_order_quantity,
      } = formData;

      const response = await axiosInstance.post(
        "/providersProducts/assignProduct",
        {
          provider_name,
          item_number,
          provider_id,
          price,
          estimated_delivery_time,
          min_order_quantity,
        },
        {
          withCredentials: true,
        }
      );

      formData.name = response.data.name;
      formData.id = response.data.itemId;

      setProvidersProductArray((prev) => [...prev, formData]);
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
        <PrimaryButton click={activePopUpFunction} text="הוספת שיוך לספק" />
      </div>
      <br />
      <br />
      <ProvidersProductTable providersProductArray={filteredProducts} />
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
