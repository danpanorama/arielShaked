import "../../App.css";
import "../../css/forms.css";
import "../../css/btn.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";
import { useState } from "react";

function SignUpEmployee({ togglePopUp,Icon, signUp,usersData,setusersData,handleUpdate }) {


const handleChange = (e) => {
  const { name, value } = e.target;

  // ולידציה פשוטה למייל - לא לאפשר אותיות בעברית
  if (name === "email") {
    const hasHebrew = /[\u0590-\u05FF]/.test(value);
    if (hasHebrew) return; // לא נעדכן סטייט אם יש עברית
  }

  setusersData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handelSignUp = (e)=>{


   
 signUp(e, usersData)


  }

  return (
    <div className="yellowPopUp">
      <CloseButton click={togglePopUp} text={"X"} />
      {usersData.id? <h1>  עדכון  עובד </h1>:  <h1>הוספת עובד חדש</h1>  }

      <form  >
        <div className="inputHolderDiv marginBottom10">
          <label className="label">שם מלא</label>
          <input 
            type="text"
            name="name"
            value={usersData.name}
            onChange={handleChange}
            className="SearchBar"
        
          />
        </div>

        <div className="inputHolderDiv marginBottom10">
          <label className="label">אימייל</label>
          <input
            type="email"
            name="email"
            value={usersData.email}
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
            value={usersData.phone}
            onChange={handleChange}
            className="SearchBar"
            placeholder="050-0000000"
          />
        </div>
        
        <div className="inputHolderDiv marginBottom10">
          <label className="label">סיסמה</label>
          <input
            type="text"
            name="password"
            value={usersData.password}
            onChange={handleChange}
            className="SearchBar"
            placeholder="הכנס סיסמה"
          />
        </div>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">אימות סיסמה</label>
          <input
            type="text"
            name="repeatPassword"
            value={usersData.repeatPassword}
            onChange={handleChange}
            className="SearchBar"
            placeholder="הכנס שוב סיסמה"
          />
        </div>
        <div className="inputHolderDiv marginBottom10">
          <label className="label">תפקיד המשתמש</label>
          <select
            name="permissions"
            value={usersData.permissions}
            onChange={handleChange}
            className="SearchBar"
          >
            <option value="">בחר תפקיד</option>
            <option value="0">עובד אפייה</option>
            <option value="1">עובד חנות</option>
            <option value="3">עוזר מנהל</option>
            <option value="4">מנהל</option> 
          </select>
        </div>
        {usersData.id? <PrimaryButton icon={Icon} click={handleUpdate} text="עדכון עובד" type="submit" />:<PrimaryButton click={handelSignUp} icon={Icon} text="הוספת עובד חדש" type="submit" />}

     

      </form>
    </div>
  ); 
}

export default SignUpEmployee;
