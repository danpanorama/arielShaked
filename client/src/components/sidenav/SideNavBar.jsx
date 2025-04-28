import "../../App.css";
import "../../css/sidenav.css";
import { Link } from "react-router-dom";

function SideNavBar() {
  const sideNavLinks = [
    { name: "הזמנות אפייה", url: "" },
    { name: " ספקים", url: "/providers" },
    { name: " מלאי", url: "/products" },
    { name: " פרטי-ספק", url: "/providersProducts" },
    { name: " הזמנות ספקים", url: "" },
    { name: " הרשאות", url: "" },
    { name: " דוחות", url: "" },
  ];

  return (
    <div className="sideNavBarController">
      <div className="sideNavLinkList">
        {sideNavLinks
          ? sideNavLinks.map((e) => {
            return(
                <div className="linkHolder flex-col-center">
                <Link className="sideNavLink" to={e.url}>
               {e.name}
                </Link>
              </div>
            )
            })
          : ""}
      </div>
    </div>
  );
}

export default SideNavBar;
