import { useState } from "react";
import "../../App.css";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";

function AddProvides(props) {
  const [providerData, setProviderData] = useState({
    name: "",
    contact_name: "",
    phone: "",
    address: "",
    delivery_time: "",
    email: "",
  });
 
  const clear = () => {
    setProviderData({
      name: "",
      contact_name: "",
      phone: "",
      address: "",
      delivery_time: "",
      email: "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProviderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <CloseButton text={"X"} click={props.activePopUp} />

      <h1>הוספת ספק חדש</h1>

      <form>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">שם ספק</label>
          <input
            className="SearchBar"
            type="text"
            name="name"
            value={providerData.name}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">שם איש קשר</label>
          <input
            className="SearchBar"
            type="text"
            name="contact_name"
            value={providerData.contact_name}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">טלפון איש קשר</label>
          <input
            className="SearchBar"
            type="text"
            name="phone"
            value={providerData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label"> זמן אספקה משוער</label>
          <input
            className="SearchBar"
            type="text"
            name="delivery_time"
            value={providerData.delivery_time}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">כתובת</label>
          <input
            className="SearchBar"
            type="text"
            name="address"
            value={providerData.address}
            onChange={handleChange}
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">מייל</label>
          <input
            className="SearchBar"
            type="email"
            name="email"
            value={providerData.email}
            onChange={handleChange}
          />
        </div>
        <div onClick={clear} className="flex-col-center">
   <PrimaryButton
          text="שמירה"
            click={() => {
              props.addProvider(providerData);
              clear();  // לאפס אחרי שליחה
            }}
         
          data={providerData}
        />
        </div>

     
        
      </form>
    </div>
  );
}

export default AddProvides;
