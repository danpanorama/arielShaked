import "../../App.css";
import "../../css/forms.css";
import "../../css/btn.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";
import { useState } from "react";

function SignUpEmployee({ togglePopUp, signUp }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "", 
    password: "",
    repeatPassword: "",
    permissions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handelSignUp = (e)=>{
   
 signUp(e, userData)

  }

  return (
    <div className="yellowPopUp">
      <CloseButton click={togglePopUp} text={"X"} />
      <h1>הוספת עובד חדש</h1>

      <form  >
        <div className="inputHolderDiv marginBottom10">
          <label className="label">שם מלא</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="SearchBar"
            placeholder="שם פרטי"
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">אימייל</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="SearchBar"
            placeholder="example@email.com"
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">טלפון</label>
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            className="SearchBar"
            placeholder="050-0000000"
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">סיסמה</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="SearchBar"
            placeholder="הכנס סיסמה"
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">אימות סיסמה</label>
          <input
            type="password"
            name="repeatPassword"
            value={userData.repeatPassword}
            onChange={handleChange}
            className="SearchBar"
            placeholder="הכנס שוב סיסמה"
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">תפקיד המשתמש</label>
          <select
            name="permissions"
            value={userData.permissions}
            onChange={handleChange}
            className="SearchBar"
          >
            <option value="">בחר תפקיד</option>
            <option value="0">עובד מאפייה</option>
            <option value="1">עובד חנות</option>
            <option value="2">עוזר מנהל</option>
            <option value="4">מנהל</option> 
          </select>
        </div>

     <PrimaryButton click={handelSignUp} text="הרשמה" type="submit" />

      </form>
    </div>
  ); 
}

export default SignUpEmployee;
