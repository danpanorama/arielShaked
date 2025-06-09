import { useState } from "react";
import "../../App.css";
import "../../css/tools.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";

function AddProvides(props) {
  const [invalidFields, setInvalidFields] = useState([]);



const validateFields = () => {
  const requiredFields = ["name", "contact_name", "phone", "address", "delivery_time", "email"];
  const invalids = requiredFields.filter((field) => !props.providerData[field]?.trim());
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasHebrew = /[\u0590-\u05FF]/;

  if (props.providerData.email && (!emailRegex.test(props.providerData.email) || hasHebrew.test(props.providerData.email))) {
    if (!invalids.includes("email")) invalids.push("email");
  }

  setInvalidFields(invalids);
  return invalids.length === 0;
};



  const handleChange = (e) => {
    const { name, value } = e.target;
    props.setProviderData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // הסר את השדה מרשימת השגיאות אם התחיל להקליד בו
    if (invalidFields.includes(name) && value.trim()) {
      setInvalidFields((prev) => prev.filter((field) => field !== name));
    }
  };

  return (
    <div className="yellowPopUp addProviderFrom">
      <CloseButton text={"X"} click={props.activePopUp} />

      <h1>הוספת ספק חדש</h1>

      <form>
        {[
          { label: "שם ספק*", name: "name" },
          { label: "שם איש קשר*", name: "contact_name" },
          { label: "טלפון איש קשר*", name: "phone" },
          { label: "זמן אספקה משוער*", name: "delivery_time" },
          { label: "כתובת*", name: "address" },
          { label: "מייל*", name: "email", type: "email" },
        ].map((field) => (
          <div className="inputHolderDiv marginBottom10" key={field.name}>
            <label className="label">{field.label}</label>
            <input
              className={`SearchBar ${invalidFields.includes(field.name) ? "invalid" : ""}`}
              type={field.type || "text"}
              name={field.name}
              value={props.providerData[field.name]} 
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="flex-col-center">
          <PrimaryButton
            text="שמירה"
            click={() => {
              if (validateFields()) {
                props.addProvider(props.providerData);
                
              }
            }}
            data={props.providerData}
          />
        </div>
      </form>
    </div>
  );
}

export default AddProvides;
