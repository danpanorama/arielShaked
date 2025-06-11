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
import { CLEAR, ERROR } from "../redux/contents/errContent";
import { getFromServer } from "../components/tools/FetchData";
import IconPlus from "../images/plus.svg";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";

function ProvidersProducts() {
  const dispatch = useDispatch();
  const [minQtyChanges, setMinQtyChanges] = useState({});

  const [activePopUp, setActivePopUp] = useState(false);
  const [providersProductArray, setProvidersProductArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [amountState, setAmount] = useState(1);
  const activePopUpFunction = () => {
    setActivePopUp(!activePopUp);
  };
  const handleMinQtyChange = (e, product) => {
  const value = e.target.value;
  setMinQtyChanges(prev => ({
    ...prev,
    [product.id]: value
  }));
};
const handleMinQtyUpdate  = async (product) => {
  const newQty = minQtyChanges[product.id];
  if (!newQty || newQty <= 0) {
    dispatch({
      type: ERROR,
      data: { message: "יש להזין כמות חוקית", header: "שגיאה" },
    });
    setTimeout(() => dispatch({ type: CLEAR }), 3000);
    return;
  }

  try {
    const res = await axiosInstance.post(
      "/providersProducts/update-min-qty",
      {
        productId: product.id,
        minQty: Number(newQty),
      },
      { withCredentials: true }
    );

    // עדכון במערך המקומי
    setProvidersProductArray(prev =>
      prev.map(p =>
        p.id === product.id ? { ...p, min_order_quantity: newQty } : p
      )
    );

    // אפס את שדה הטקסט
    setMinQtyChanges(prev => {
      const newState = { ...prev };
      delete newState[product.id];
      return newState;
    });

  } catch (err) {
    dispatch({
      type: ERROR,
      data: {
        message: err?.response?.data?.message || "שגיאה בעדכון כמות מינ'",
        header: "שגיאה",
      },
    });
    setTimeout(() => dispatch({ type: CLEAR }), 3000);
  }
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

  const filteredProducts = filterBySearchTerm(
    providersProductArray,
    searchTerm,
    ["provider_name", "item_number", "name"]
  );

  async function associateProductToProvider(formData, clearData) {
    try {
      const {
        provider_name,
        item_number,
        provider_id,
        price,
        min_order_quantity,
      } = formData;
      if (price <= 0 || min_order_quantity <= 0) {
        return dispatch({
          type: ERROR,
          data: { message: "למלא את כל המידע " ,header:'שגיאה'}
        });
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

      setActivePopUp(false);
      console.log(response.data);
      setProvidersProductArray((prev) => [...prev, response.data.obj]);
      setSearchTerm("");
      clearData({
        item_number: "",
        provider_id: "",
        price: "",
        min_order_quantity: "",
      }); //
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בעת שיוך מוצר לספק",
          header: "שגיאה בשיוך",
        },
      });
             setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    }
  }

  function handlePaymentAmount(e) {
    setAmount(e.target.value);
  }

  const handlePaymentUpdate = async (product) => {
    try {
      
      if (amountState <= 0) {
        return;
      }
      const res = await axiosInstance.post(
        "/providersProducts/update-payment",
        {
          productId: product.id,
          newPrice: Number(amountState),
        },
        { withCredentials: true }
      );


  
      setAmount(0);
    } catch (err) {
      dispatch({
        type: ERROR,
        data: {
          message: err?.response?.data?.message || "שגיאה בעדכון מחיר",
          header: "שגיאה",
        },
      });
             setTimeout(() => {
      dispatch({ type: CLEAR });
    }, 3000);
    }
  };

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="שיוך מוצרים לספקים" />
      <div className="flex-row-bet">
        <SearchBar onSearch={(value) => setSearchTerm(value)} />
        <PrimaryButton
          icon={IconPlus}
          click={activePopUpFunction}
          text="הוספת שיוך לספק"
        />
      </div>
      <br />
      <br />
      <ProvidersProductTable
        handlePaymentAmount={handlePaymentAmount}
        handlePaymentUpdate={handlePaymentUpdate}
        providersProductArray={filteredProducts}
        handleMinQtyUpdate={handleMinQtyUpdate} 
        handleMinQtyChange={handleMinQtyChange}
      />
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
