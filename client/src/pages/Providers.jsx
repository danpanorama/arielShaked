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

function Providers() {
  const dispatch = useDispatch();
  const [activeProvidersPopUp, setProvidersPopUpState] = useState(false);
  const [providersArray, setProvidersArray] = useState([]);

  const activePopUp = () => {
    setProvidersPopUpState(!activeProvidersPopUp);
  };

  // פונקציה כללית לשימוש חוזר
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
      setProvidersArray,
      "התרחשה שגיאה בעת שליפת הספקים",
      "שגיאה בטעינת ספקים"
    );
  }, []);

  const addProvider = async (newProvider) => {
    try {
      const response = await axiosInstance.post("/providers/addProvider", newProvider, {
        withCredentials: true,
      });
      setProvidersArray((prev) => [...prev, response.data.data]);
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
      (id)
      const response = await axiosInstance.post('/providers/removeProvider',{id:id}, {
        withCredentials: true,
      });
      setProvidersArray((prev) =>
        prev.filter((provider) => provider._id !== id)
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
  

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="ספקים" />
      <div className="flex-row-bet">
        <SearchBar />
        <PrimaryButton click={activePopUp} text={"הוסף ספק חדש"} />
      </div>
      <br />
      <br />
      <ProviderTable providers={providersArray} deleteProvider={deleteProvider} />
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
