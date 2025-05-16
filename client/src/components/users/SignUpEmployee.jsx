import "../../App.css";
import "../../css/forms.css";
import "../../css/btn.css";
import PrimaryButton from "../btn/PrimaryButton";
import CloseButton from "../btn/CloseButton";

function SignUpEmployee({
  togglePopUp,
  userData,
  handleChange,
  signUp,
  isError,
  errorMessages,
}) {
  return (
    <form className=" " onSubmit={signUp}>
      <CloseButton click={togglePopUp} text={"X"} />

      <br />
      <br />
      <h1>הוספת עובד חדש</h1>
      <div className="inputBox">
        <input
          name="name"
          placeholder="שם פרטי"
          className={`input ${isError?.name ? "inputError" : ""}`}
          type="text"
          value={userData?.name || ""}
          onChange={handleChange}
        />
        {isError?.name && (
          <span className="errorText">{errorMessages.name}</span>
        )}
      </div>

      <div className="inputBox">
        <input
          name="email"
          placeholder="אימייל"
          className={`input ${isError?.email ? "inputError" : ""}`}
          type="email"
          value={userData?.email}
          onChange={handleChange}
        />
        {isError?.email && (
          <span className="errorText">{errorMessages.email}</span>
        )}
      </div>

      <div className="inputBox">
        <input
          name="phone"
          placeholder="טלפון"
          className={`input ${isError?.phone ? "inputError" : ""}`}
          type="tel"
          value={userData?.phone}
          onChange={handleChange}
        />
        {isError?.phone && (
          <span className="errorText">{errorMessages.phone}</span>
        )}
      </div>

      <div className="inputBox">
        <input
          name="password"
          placeholder="סיסמה"
          className={`input ${isError?.password ? "inputError" : ""}`}
          type="password"
          value={userData?.password}
          onChange={handleChange}
        />
        {isError?.password && (
          <span className="errorText">{errorMessages.password}</span>
        )}
      </div>

      <div className="inputBox">
        <input
          name="repeatPassword"
          placeholder="אימות סיסמה"
          className={`input ${isError?.repeatPassword ? "inputError" : ""}`}
          type="password"
          value={userData?.repeatPassword}
          onChange={handleChange}
        />
        {isError?.repeatPassword && (
          <span className="errorText">{errorMessages.repeatPassword}</span>
        )}
      </div>

      <div className="inputBox">
        <label>
          תפקיד המשתמש:
          <select
            name="permissions"
            value={userData?.permissions || ""}
            onChange={handleChange}
          >
            <option value="0">בחר תפקיד</option>

            <option value="0">עובד מאפייה</option>
            <option value="1">עובד חנות</option>
            <option value="2">עוזר מנהל</option>

            <option value="4">מנהל</option>
          </select>
        </label>
      </div>

      <div className="flex-col-center">
        <button className="PrimaryButton" type="submit">
          הרשם
        </button>
      </div>
    </form>
  );
}
export default SignUpEmployee;
