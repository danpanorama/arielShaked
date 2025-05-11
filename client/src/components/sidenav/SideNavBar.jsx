import { useState } from "react";
import { useSelector } from "react-redux";
import "../../App.css";
import "../../css/sidenav.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartPopup from "../popup/CartPopUp"; // 📦 ייבוא הקופסה

function SideNavBar() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false); // 🟢 ניהול מצב פתיחה/סגירה של העגלה

  const sideNavLinks = [
    { name: "הזמנות אפייה", url: "/orders" },
    { name: " ספקים", url: "/providers" },
    { name: " מלאי", url: "/products" },
    { name: " פרטי-ספק", url: "/providersProducts" },
    { name: " הזמנות ספקים", url: "/providersOrders" },
    { name: " הרשאות", url: "/users" },
    { name: " דוחות", url: "" },
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
        {sideNavLinks.map((e) => (
          <div key={e.url} className="linkHolder flex-col-center">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "sideNavLink activeLink flex-col-center"
                  : "sideNavLink flex-col-center"
              }
              to={e.url}
            >
              {e.name}
            </NavLink>
          </div>
        ))}

        {/* 🛒 כפתור העגלה */}
        <div className="linkHolder flex-col-center">
          <button className="sideNavLink" onClick={() => setIsCartOpen(true)}>
            🛒 העגלה שלי
          </button>
        </div>
      </div>

      {/* 🔘 כפתור Logout */}
      <div className="logoutBtnHolder flex-col-center">
        <button className="logoutBtn" onClick={handleLogout}>
          התנתקות
        </button>
      </div>

      {/* 📦 פופאפ עגלה */}
      {isCartOpen && <CartPopup close={() => setIsCartOpen(false)} />}
    </div>
  );
}

export default SideNavBar;
