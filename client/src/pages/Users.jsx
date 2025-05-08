import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../App.css";

import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import "../css/users.css";
import PopUpGeneral from "../components/popup/PopUpGeneral";
import Headers from "../components/header/Headers";
import axiosInstance from "../config/AxiosConfig";
import { ERROR } from "../redux/contents/errContent";
import UsersTable from "../components/tables/UsersTable";
import UserTable from "../components/tables/UsersTable";

function Users() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [isPopUpActive, setIsPopUpActive] = useState(false);

  const togglePopUp = () => {
    setIsPopUpActive(!isPopUpActive);
  };

  async function onRevokePermission(id, permission) {
    try {
      // שלח בקשה לשרת לעדכון (אם צריך)
      await axiosInstance.post(
        "/users/permissions",
        { id, permission },
        { withCredentials: true }
      );
  
      // עדכן את הסטייט של המשתמשים בלייב
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, permissions: permission } : user
        )
      );
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בעדכון ההרשאה",
          header: "שגיאה בעדכון משתמש",
        },
      });
    }
  }
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users", {
        withCredentials: true,
      });
      setUsers(response.data.users);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בשליפת משתמשים",
          header: "שגיאה בטעינת משתמשים",
        },
      });
    }
  };

  const addUser = async (newUser) => {
    try {
      const response = await axiosInstance.post("/users/addUser", newUser, {
        withCredentials: true,
      });
      setUsers((prev) => [...prev, response.data.user]);
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה בהוספת משתמש",
          header: "שגיאה בהוספת משתמש חדש",
        },
      });
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.post("/users/removeUser", { userId }, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (e) {
      dispatch({
        type: ERROR,
        data: {
          message: e?.response?.data?.message || "שגיאה במחיקת משתמש",
          header: "שגיאה במחיקת משתמש",
        },
      });
    }
  };

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="משתמשים / עובדים" />
      <div className="flex-row-bet">
        <SearchBar />
        <PrimaryButton click={togglePopUp} text="הוסף משתמש חדש" />
      </div>
      <br />
      <br />
      <UserTable onRevokePermission={onRevokePermission} users={users} onDelete={deleteUser} />
      <PopUpGeneral
        type="user"
        click={togglePopUp}
        isPopUpActive={isPopUpActive}
        addProvider={addUser}
        activePopUp={togglePopUp}
      />
    </div>
  );
}

export default Users;
