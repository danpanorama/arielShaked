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

function Users() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [isPopUpActive, setIsPopUpActive] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userDataState, setUserDataState] = useState({
       name: "",
    email: "",
    phone: "", 
    password: "",
    repeatPassword: "",
    permissions: "",
  });


  const [errorMessages, setErrorMessages] = useState({});
  const [isError, setIsError] = useState({});
  const togglePopUp = () => {
      setUserDataState({
    name:  "",
    password:  "",
    repeatPassword:  "", // או השאר ריק אם לא נדרש
    email:  "",
    phone:  "",
    permissions:  0,
    is_active: 1,
  });
    setIsPopUpActive((prev) => !prev);
  };
  const handleRowClick = (user) => {
    console.log(user)
  setUserDataState({
    id:user.id||null,
    name: user.name || "",
    password: user.password || "",
    repeatPassword: user.password || "", // או השאר ריק אם לא נדרש
    email: user.email || "",
    phone: user.phone || "",
    permissions: user.permissions ?? 0,
    is_active: user.is_active ?? 1,
  });

  setIsPopUpActive(true); // פותח את הפופאפ
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

  const signUp = async (e,userdata,setUserData) => {
    e.preventDefault();

    
    if (user.user.permission < 2) {
      return dispatch({
        type: ERROR,
        data: { message: "אין לך הרשאות", header: "אתה לא מנהל" },
      });
      
   
    }

    try {
      
      const response = await axiosInstance.post(
        "/users/adduser",
        userdata,
        { withCredentials: true }
      );
      if(response.data.error){
       
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



const handleUpdate = async (data) => {
  if (user.user.permission < 2) {
    return dispatch({
      type: ERROR,
      data: { message: "אין לך הרשאות לעדכון משתמש", header: "גישה נדחתה" },
    });
  }
  console.log(data)

  if (!validateForm()) {
    return dispatch({
      type: ERROR,
      data: { message: "יש שדות לא תקינים בטופס", header: "שגיאת אימות" },
    });
  }

  try {
    const response = await axiosInstance.post(
      "/users/update",
      userDataState,
      { withCredentials: true }
    );
  
    if (response.data.error) {
      return dispatch({
        type: ERROR,
        data: {
          message: response.data.error.message || "שגיאה בעדכון משתמש",
          header: "שגיאה",
        },
      });
    }

    // עדכון המשתמש ברשימת המשתמשים המקומית
  setUsers((prevUsers) =>
  prevUsers.map((u) => (u.id === userDataState.id ? userDataState : u))
);


    togglePopUp();

  } catch (e) {
    dispatch({
      type: ERROR,
      data: {
        message: e?.response?.data?.message || "שגיאה בעדכון משתמש",
        header: "שגיאה",
      },
    });
  }
};




  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text=" עובדים" />
      <div className="flex-row-bet">
        <SearchBar onSearch={handleSearch} />
        <PrimaryButton icon={Icon} click={togglePopUp} text="הוספת עובד חדש" />
      </div>
      <br />
      <UserTable
        users={filteredUsers.length > 0 ? filteredUsers : users}
        onDelete={handleDeleteUser}
        onActiveUsers={handleActiveUsers}
        myUserId={user.user.id}
         onRowClick={handleRowClick}
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
        setusersData={setUserDataState}
        errorMessages={errorMessages}
        userDataState={userDataState}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}

export default Users;
