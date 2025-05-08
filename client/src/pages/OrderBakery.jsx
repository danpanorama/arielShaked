import { useState } from 'react';
import '../App.css';
import '../css/order.css';

import PrimaryButton from "../components/btn/PrimaryButton";
import SearchBar from "../components/searchbar/SearchBar";
import SideNavBar from "../components/sidenav/SideNavBar";
import Headers from "../components/header/Headers";
import OrderPopUp from '../components/popup/OrderPopUp';

function OrderBakery() {
  const [showPopup, setShowPopup] = useState(false);
  const handleNewOrderClick = () => {
    // כאן תוכל להוסיף בקשת fetch או axios אם צריך לשלוח מידע
    // לדוגמה:
    // axios.post('/orders/new', {...data})

    setShowPopup(true); // הצגת הפופאפ
  };

  return (
    <div className="providersContainer">
      <SideNavBar />
      <Headers text="מלאי" />

      <div className="flex-row-bet">
        <div className="flex-row-bet">
          <PrimaryButton click={handleNewOrderClick} text="הזמנה חדשה" />
        </div>
      </div>



      {/* <div className="gridOrders">
        <div className="oneOrder">
          <h1 className="orderHeader">קטגוריה: פיתות</h1>
          <div className="orderHolder">
            <div className="orderInfo">
              <p className="product">מה בהזמנה:</p>
              <p className="product">רוגלך 2</p>
              <p className="product">שוקולד 3</p>
              <p className="product">קינמון 1</p>
            </div>
            <div className="orderStatus">
              <h1 className="orderHeader">סטטוס: בהכנה</h1>
              <h1 className="orderHeader">זמן משוער לסיום:</h1>
            </div>
          </div>
        </div>

        
      </div> */}
      {showPopup && <OrderPopUp close={() => setShowPopup(false)} />}
    </div>
  );
}

export default OrderBakery;
