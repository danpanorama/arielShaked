import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../App.css";

import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import ProviderTable from "../components/tables/ProviderTable";
import "../css/providers.css";
import PopUpGeneral from "../components/popup/PopUpGeneral";
import Headers from "../components/header/Headers";
import axiosInstance from "../config/AxiosConfig";
import { ERROR } from "../redux/contents/errContent";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";


function Providers() {
  const dispatch = useDispatch();
  const [activeProvidersPopUp, setProvidersPopUpState] = useState(false);
  const [providersArray, setProvidersArray] = useState([]);
  const [filteredProvidersArray, setFilteredProvidersArray] = useState([]);

  const activePopUp = () => {
    setProvidersPopUpState(!activeProvidersPopUp);
  };

  const fetchData = async (url, setter, errorMsg, errorHeader) => {
    try {
      const response = await axiosInstance.get(url, {
        withCredentials: true,
      });
      setter(response.data);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || errorMsg,
          header: errorHeader,
        },
      });
    }
  };

  useEffect(() => {
    fetchData(
      "/providers",
      (data) => {
        setProvidersArray(data);
        setFilteredProvidersArray(data);
      },
      "התרחשה שגיאה בעת שליפת הספקים",
      "שגיאה בטעינת ספקים"
    );
  }, []);

  const addProvider = async (newProvider) => {
    try {
      const response = await axiosInstance.post("/providers/addProvider", newProvider, {
        withCredentials: true,
      });
       console.log(response.data.data)
      setProvidersArray((prev) => [...prev, response.data.data]);
      setFilteredProvidersArray((prev) => [...prev, response.data.data]);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.message || "שגיאה כללית בהוספת ספק",
          header: e?.header || "שגיאה בעת הוספת ספק חדש",
        },
      });
    }
  };

  const deleteProvider = async (id) => {
    try {
      const response = await axiosInstance.post('/providers/removeProvider',{id:id}, {
        withCredentials: true,
      });
      setProvidersArray((prev) =>
        prev.filter((provider) => provider.id !== id)
      );
      setFilteredProvidersArray((prev) =>
        prev.filter((provider) => provider.id !== id)
      );
      
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.message || "שגיאה כללית במחיקת ספק",
          header: "שגיאה בעת מחיקת ספק",
        },
      });
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = filterBySearchTerm(providersArray, searchTerm, ["name","id","phone"]); // פילטר על שדה ה-name, אפשר להוסיף שדות נוספים
    setFilteredProvidersArray(filtered);
  };

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="ספקים" />
      <div className="flex-row-bet">
        <SearchBar onSearch={handleSearch} />
        <PrimaryButton click={activePopUp} text={"הוסף ספק חדש"} />
      </div>
      <br />
      <br />
      <ProviderTable providers={filteredProvidersArray} deleteProvider={deleteProvider} />
      <PopUpGeneral
        click={activePopUp}
        isPopUpActive={activeProvidersPopUp}
        addProvider={addProvider}
        activePopUp={activePopUp}
        type="provider"
      />
    </div>
  );
}

export default Providers;
