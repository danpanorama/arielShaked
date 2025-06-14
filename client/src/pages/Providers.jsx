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
import { CLEAR, ERROR } from "../redux/contents/errContent";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";
import Icon1 from '../images/plus.svg'


function Providers() {
  const dispatch = useDispatch();
  const [activeProvidersPopUp, setProvidersPopUpState] = useState(false);
  const [providersArray, setProvidersArray] = useState([]);
  const [filteredProvidersArray, setFilteredProvidersArray] = useState([]);
    const [providerData, setProviderData] = useState({
    name: "",
    contact_name: "",
    phone: "",
    address: "",
    delivery_time: "",
    email: "",
  });
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
             setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
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
      if(!newProvider.name){
        
      }


      const response = await axiosInstance.post("/providers/addProvider", newProvider, {
        withCredentials: true, 
      });
      setProvidersPopUpState(false)
      setProvidersArray((prev) => [...prev, response.data.data]);
      setFilteredProvidersArray((prev) => [...prev, response.data.data]);

      setProviderData({
    name: "",
    contact_name: "",
    phone: "",
    address: "",
    delivery_time: "",
    email: ""})


    } catch (e) {
      console.log(e.response.data.error.message)
      dispatch({
        type: ERROR,
        data: {
          message: e?.response.data.error.message || "שגיאה כללית בהוספת ספק",
          header: e?.response.data.error.header || "שגיאה בעת הוספת ספק חדש",
        },
      });
             setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    }
  };


 const changeStatus = async (provider, status) => {
  try {
    const obj = {
      providerId: provider.id,
      status: status,
    };

    const response = await axiosInstance.post("/providers/changeStatus", obj, {
      withCredentials: true,
    });

    const updatedProvider = provider;

    // עדכון הספק במערך המקורי לפי ה-ID
    setProvidersArray((prev) =>
      prev.map((p) =>
        p.id === updatedProvider.id
          ? { ...p, is_active: status }
          : p
      )
    );

    setFilteredProvidersArray((prev) =>
      prev.map((p) =>
        p.id === updatedProvider.id
          ? { ...p, is_active: status }
          : p
      )
    );
  } catch (e) {
    dispatch({ 
      type: ERROR,
      data: {
        message:  "שגיאה כללית בעדכון סטטוס ספק",
        header: e?.header || "שגיאה בעדכון סטטוס",
      },
    });
           setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
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
             setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
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
        <PrimaryButton icon={Icon1} click={activePopUp} text={"הוספת ספק חדש"} />
      </div>
      <br />
      <br />
      <ProviderTable changeStatus={changeStatus} providers={filteredProvidersArray} deleteProvider={deleteProvider} />
      <PopUpGeneral
      providerData={providerData}
        click={activePopUp}
        isPopUpActive={activeProvidersPopUp}
        addProvider={addProvider}
        activePopUp={activePopUp}
         setProviderData={setProviderData}
        type="provider"
      />
    </div>
  );
}

export default Providers;
