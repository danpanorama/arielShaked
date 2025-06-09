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
import IconPlus from "../images/plus.svg";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";

function ProvidersProducts() {
  const dispatch = useDispatch();
  const [activePopUp, setActivePopUp] = useState(false);
  const [providersProductArray, setProvidersProductArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [amountState, setAmount] = useState(1);
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
    }
  }

  function handlePaymentAmount(e) {
    setAmount(e.target.value);
  }

  const handlePaymentUpdate = async (product) => {
    try {
      console.log(product);
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
      console.log(res.data);

      //     const updatedOrder = products;

      //     const payment = res.data?.allPayments; // ודא שאתה מקבל את זה נכון מהשרת

      // setOrders((prevOrders) =>
      //   prevOrders.map((o) => {
      //     if (o.id === order.id) {
      //       const updatedAmountPaid = payment;
      //       const isFullyPaid = o.price <= updatedAmountPaid;
      //       return {
      //         ...o,
      //         amount_paid: updatedAmountPaid,
      //         is_paid: isFullyPaid ? 1 : 0,
      //       };
      //     }
      //     return o;
      //   })
      // );

      // setFilteredOrders((prevFiltered) =>
      //   prevFiltered.map((o) => {
      //     if (o.id === order.id) {
      //       const updatedAmountPaid = payment;
      //       const isFullyPaid = o.price <= updatedAmountPaid;
      //       return {
      //         ...o,
      //         amount_paid: updatedAmountPaid,
      //         is_paid: isFullyPaid ? 1 : 0,
      //       };
      //     }
      //     return o;
      //   })
      // );
      // אופציונלי: איפוס שדה תשלום לאחר ההצלחה
      setAmount(0);
    } catch (err) {
      dispatch({
        type: ERROR,
        data: {
          message: err?.response?.data?.message || "שגיאה בעדכון מחיר",
          header: "שגיאה",
        },
      });
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
