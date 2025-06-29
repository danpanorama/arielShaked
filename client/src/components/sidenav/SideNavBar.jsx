import { useState } from "react";
import { useSelector } from "react-redux";
import "../../App.css";
import "../../css/sidenav.css";
import { Link, NavLink, useNavigate } from "react-router-dom";


function SideNavBar() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false); // 🟢 ניהול מצב פתיחה/סגירה של העגלה

const sideNavLinks = [
  { name: "הזמנות אפייה", url: "/orders", permissions: [2,1, 3,4] },
  { name: "הזמנות ייצור", url: "/kitchen", permissions: [3,4,2,0] },
  { name: "ספקים", url: "/providers", permissions: [3,4,2] },
  { name: "מלאי", url: "/products", permissions: [3,4,2,1,0] },
  { name: "פריט-ספק", url: "/providersProducts", permissions: [3,4,2] },
  { name: "הזמנות ספקים", url: "/providersOrders", permissions: [3,4,2] },
  { name: "הרשאות", url: "/users", permissions: [4] },
  { name: "דוחות", url: "/reports", permissions: [3,4] },
];


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/login/logout", {
        method: "GET",
        credentials: "include",
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("שגיאה בלוגאאוט:", error);
    }
  };
 

  return (
    <div className="sideNavBarController">
      <div className="sideNavLinkList">
        <p className="username">{user.user.name}</p>

        <p className="userPermissions">
            {user.user.permissions === 0
    ? "עובד "
    : user.user.permissions === 1
    ? "עובד חנות"
    : user.user.permissions === 2
    ? "עוזר מנהל"
    : user.user.permissions === 3
    ? "מנהל"
     : user.user.permissions === 4
    ? "מנהל"
    : "לא מוגדר"}
        </p>
    
      {sideNavLinks
  .filter((link) => link.permissions.includes(user.user?.permissions))
  .map((e) => (
       <NavLink
        className={({ isActive }) =>
          isActive
            ? "sideNavLink activeLink flex-col-center linkHolder flex-col-center"
            : "sideNavLink flex-col-center linkHolder flex-col-center"
        }
        to={e.url}
      >
    <div key={e.url} className="">
   
        {e.name}
      
    </div>
    </NavLink>
))}


     
    
      </div>

      {/* 🔘 כפתור Logout */}
      <div className="logoutBtnHolder flex-col-center">
        <button className="logoutBtn" onClick={handleLogout}>
          התנתקות
        </button>
      </div>

    </div>
  );
}

export default SideNavBar;
