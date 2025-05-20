import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../App.css";

import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import "../css/users.css";
import PopUpGeneral from "../components/popup/PopUpGeneral";
import Headers from "../components/header/Headers";
import axiosInstance from "../config/AxiosConfig";
import { ERROR } from "../redux/contents/errContent";
import UserTable from "../components/tables/UsersTable";
import Icon from '../images/plus.svg'
import SignUpEmployee from "../components/users/SignUpEmployee";
import {
  validatePassword,
  validateEmail,
} from "../components/tools/Validation";
import { filterBySearchTerm } from "../components/tools/filterBySearchTerm";
// 👈 שים לב לנתיב הנכון
// ... (imports שנשארים כמו שהם)
function Users() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [isPopUpActive, setIsPopUpActive] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [userDataState, setUserDataState] = useState({
    name: "",
    password: "",
    repeatPassword: "",
    email: "",
    phone: "",
    permissions: 0,
    is_active: 1, // ערך ברירת מחדל
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [isError, setIsError] = useState({});

  const togglePopUp = () => {
    setIsPopUpActive((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUserDataState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateField(name, value);
  };

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
        }
        break;
      case "email":
        if (!validateEmail(value)) {
          valid = false;
          newErrorMessages.email = "אימייל לא תקין";
          newIsError.email = true;
        }
        break;
      case "password":
        if (!validatePassword(value)) {
          valid = false;
          newErrorMessages.password = "הסיסמא חלשה";
          newIsError.password = true;
        }
        break;
      case "repeatPassword":
        if (value !== userDataState.password) {
          valid = false;
          newErrorMessages.repeatPassword = "הסיסמאות לא תואמות";
          newIsError.repeatPassword = true;
        }
        break;
      default:
        break;
    }

    setErrorMessages((prev) => ({ ...prev, ...newErrorMessages }));
    setIsError((prev) => ({ ...prev, ...newIsError }));

    return valid;
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(userDataState).forEach((field) => {
      if (!validateField(field, userDataState[field])) valid = false;
    });
    return valid;
  };

  const signUp = async (e,userdata) => {
    
    e.preventDefault();
    console.log(user.user.permission)
setUserDataState({
    name: "",
    password: "",
    repeatPassword: "",
    email: "",
    phone: "",
    permissions: 0,
    is_active: 1,})
    
    if (user.user.permission < 2) {
      return dispatch({
        type: ERROR,
        data: { message: "אין לך הרשאות", header: "אתה לא מנהל" },
      });
      
   
    }

    // if (!validateForm()) return;

    try {


      
      const response = await axiosInstance.post(
        "/users/adduser",
        userdata,
        { withCredentials: true }
      );
      if(response.data.error){
        console.log(response.data)
         return dispatch({
        type: ERROR,
        data: {
          message: response.data?.error.message || "שגיאה בהוספת משתמש",
          header: "שגיאה",
        },
      });
      }
     
      setUsers((prev) => [...prev, response.data.user]); 
      togglePopUp();
      // איפוס שדות
      setUserDataState({
        name: "",
        password: "",
        repeatPassword: "",
        email: "",
        phone: "",
        permissions: 0,
        is_active: true,
      });

      // איפוס שגיאות
      setErrorMessages({});
      setIsError({});
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בהוספת משתמש",
          header: "שגיאה",
        },
      });
    }
  };
  const handleDeleteUser = async (userId) => {
    if (user.user.permission < 3) {
      return dispatch({
        type: ERROR,
        data: { message: "אין לך הרשאות למחיקת משתמשים", header: "גישה נדחתה" },
      });
    }

    try {
      await axiosInstance.post(
        `/users/removeUser`,
        { userId: userId },
        { withCredentials: true }
      );

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה במחיקת המשתמש",
          header: "שגיאה",
        },
      });
    }
  };
  const handleActiveUsers = async (userId, permission) => {
    if (user.user.permission < 3) {
      return dispatch({
        type: ERROR,
        data: { message: "אין לך הרשאות למחיקת משתמשים", header: "גישה נדחתה" },
      });
    }
 

    try {
      await axiosInstance.post(
        `/users/active`,
        { userId: userId, permission: permission },
        { withCredentials: true }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: permission } : user
        )
      );
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בהשאיית המשתמש",
          header: "שגיאה",
        },
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users", { withCredentials: true });
      setUsers(res.data.users);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: { message: "שגיאה בטעינה", header: "טעינת משתמשים נכשלה" },
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    setFilteredUsers(users); // עדכון רשימת המשתמשים המסוננים בכל פעם ש-users משתנים
  }, [users]);

  const handleSearch = (searchTerm) => {
    const filtered = filterBySearchTerm(users, searchTerm, [
      "name",
      "id",
      "phone",
    ]);
    setFilteredUsers(filtered);
  };

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="משתמשים / עובדים" />
      <div className="flex-row-bet">
        <SearchBar onSearch={handleSearch} />
        <PrimaryButton icon={Icon} click={togglePopUp} text="הוספת משתמש חדש" />
      </div>
      <br />
      <UserTable
        users={filteredUsers.length > 0 ? filteredUsers : users}
        onDelete={handleDeleteUser}
        onActiveUsers={handleActiveUsers}
        myUserId={user.user.id}
      />

      <PopUpGeneral
        type="user"
        isPopUpActive={isPopUpActive}
        activePopUp={togglePopUp}
        users={users}
        userData={userDataState}
        addUser={signUp}
        handleChange={handleChange}
        togglePopUp={togglePopUp}
        isError={isError}
        errorMessages={errorMessages}
      />
    </div>
  );
}

export default Users;
