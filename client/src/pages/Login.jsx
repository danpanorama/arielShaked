import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../App.css";
import "../css/forms.css";
import "../css/btn.css";
import { loginAction, signUpAction } from "../redux/actions/userActions";
import { useState } from "react";
import Logo from "../images/bigLogo.svg";

function SignUp() {
  const dispatch = useDispatch();
  
  // State for form data and errors
  const [userDataState, setUserDataState] = useState({
    email: "",
    password: "",
  });

  const [isError, setIsError] = useState({
    email: false,
    password: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    let errors = { email: false, password: false };
    let messages = { email: "", password: "" };

    if (!userDataState.email) {
      valid = false;
      errors.email = true;
      messages.email = "שדה שם פרטי נדרש";
    }

    if (!userDataState.password) {
      valid = false;
      errors.password = true;
      messages.password = "שדה סיסמה נדרש";
    }

    setIsError(errors);
    setErrorMessages(messages);
    return valid;
  };
const navigate = useNavigate()
  // Handle form submission
  const login = () => {
    if (validateForm()) {
      dispatch(loginAction(userDataState, navigate));
    }
  };

  return (
    <div className="drtl container bcYellow  min-h100vh">
      <div className="signUp-Container">
        <div className="form flex-col-center">
          <div className="imageLogo">
            <img className="img" src={Logo} alt="Logo" />
          </div>

          <div className="inputBox">
            <input
              name="email"
              placeholder="שם פרטי"
              className={`input ${isError.email ? "inputError" : ""}`}
              type="text"
              value={userDataState.email}
              onChange={handleChange}
            />
            {isError.email && (
              <span className="errorText">{errorMessages.email}</span>
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
          <button onClick={login} className="bcYellow buttons" type="submit">
            כניסה
          </button>

          <div className="navigateToLogIn">
            <Link to={"/sign-up"}>הרשמה</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
