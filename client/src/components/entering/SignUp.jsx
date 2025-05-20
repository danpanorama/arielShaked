import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {validateEmail,validatePassword} from '../../components/tools/Validation'

import "../../App.css";
import "../../css/forms.css";
import "../../css/btn.css";

import { signUpAction } from "../../redux/actions/userActions";
import Logo from "../../images/bigLogo.svg";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [userDataState, setUserDataState] = useState({
    name: "",
  
    password: "",
    repeatPassword: "",
    email: "",
    phone: "",
    permissions: 4,
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [isError, setIsError] = useState({});


  const validateField = (name, value) => {
    let valid = true;
    let newErrorMessages = {};
    let newIsError = {};
  
    switch (name) {
      case "name":
        if (!value.trim()) {
          valid = false;
          newErrorMessages.name = "שם פרטי חובה";
          newIsError.name = true;
        } else {
          valid = true;
          newErrorMessages.name = "";
          newIsError.name = false;
        }
        break;
  
   
  
      case "email":
        if (!validateEmail(value)) {
          valid = false;
          newErrorMessages.email = "אימייל לא תקין";
          newIsError.email = true;
        } else {
          valid = true;
          newErrorMessages.email = "";
          newIsError.email = false;
        }
        break;
  
      case "password":
        if (!validatePassword(value)) {
          valid = false;
          newErrorMessages.password = "הסיסמא חייבת לכלול לפחות 8 תווים, אותיות ומספרים";
          newIsError.password = true;
        } else {
          valid = true;
          newErrorMessages.password = "";
          newIsError.password = false;
        }
        break;
  
      case "repeatPassword":
        if (value !== userDataState.password) {
          valid = false;
          newErrorMessages.repeatPassword = "הסיסמאות אינן תואמות";
          newIsError.repeatPassword = true;
        } else {
          valid = true;
          newErrorMessages.repeatPassword = "";
          newIsError.repeatPassword = false;
        }
        break;
  
      default:
        break;
    }
  
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      ...newErrorMessages,
    }));
    setIsError((prevErrors) => ({
      ...prevErrors,
      ...newIsError,
    }));
  
    return valid;
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(userDataState).forEach((field) => {
      if (!validateField(field, userDataState[field])) {
        valid = false;
      }
    });
    return valid;
  };

  const signUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(signUpAction(userDataState,navigate));
    }
  };

  return (
    <div className="drtl container bcYellow min-h100vh">
      <div className="signUp-Container">
        <form className="form flex-col-center" onSubmit={signUp}>
          <div className="imageLogo">
            <img className="img" src={Logo} alt="Logo" />
          </div>

          <div className="inputBox">
            <input
              name="name"
              placeholder="שם פרטי"
              className={`input ${isError.name ? "inputError" : ""}`}
              type="text"
              value={userDataState.name}
              onChange={handleChange}
            />
            {isError.name && (
              <span className="errorText">{errorMessages.name}</span>
            )}
          </div>


          <div className="inputBox">
            <input
              name="email"
              placeholder="אימייל"
              className={`input ${isError.email ? "inputError" : ""}`}
              type="email"
              value={userDataState.email}
              onChange={handleChange}
            />
            {isError.email && (
              <span className="errorText">{errorMessages.email}</span>
            )}
          </div>
          <div className="inputBox">
  <input
    name="phone"
    placeholder="טלפון"
    className={`input ${isError.phone ? "inputError" : ""}`} // אם יש שגיאה בטלפון, תוסיף את ה-class של השגיאה
    type="tel" // השתמש ב-type="tel" כי זה מתאים יותר לטלפונים
    value={userDataState.phone}
    onChange={handleChange} // יעדכן את ה-state
  />
  {isError.phone && (
    <span className="errorText">{errorMessages.phone}</span> // אם יש שגיאה בטלפון, תציג את ההודעה
  )}
</div>


          <div className="inputBox">
            <input
              name="password"
              placeholder="סיסמה"
              className={`input ${isError.password ? "inputError" : ""}`}
              type="password"
              value={userDataState.password}
              onChange={handleChange}
            />
            {isError.password && (
              <span className="errorText">{errorMessages.password}</span>
            )}
          </div>

          <div className="inputBox">
            <input
              name="repeatPassword"
              placeholder="אימות סיסמה"
              className={`input ${isError.repeatPassword ? "inputError" : ""}`}
              type="password"
              value={userDataState.repeatPassword}
              onChange={handleChange}
            />
            {isError.repeatPassword && (
              <span className="errorText">
                {errorMessages.repeatPassword}
              </span>
            )}
          </div>

       

          <button className="bcYellow buttons" type="submit">
            הרשמה
          </button>

          <div className="navigateToLogIn">
            <Link to={"/login"}>כניסה</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
