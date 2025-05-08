import '../../css/order.css';
import { useState } from 'react';

function OrderPopUp({ close }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  const categories = [
    { name: "פיתות", items: ["פיתה לבנה", "פיתה מלאה"] },
    { name: "מאפים", items: ["קרואסון", "בורקס גבינה"] },
    { name: "עוגות", items: ["עוגת שוקולד", "עוגת גבינה"] },
    { name: "לחמים", items: ["לחם לבן", "לחם מחמצת"] },
  ];

  const handleItemClick = (item) => {
    setCart((prev) => [...prev, item]);
    alert(`הפריט "${item}" נוסף לעגלה`);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="popupOverlay">
      <div className="popupContainer">
        <br /><br />
        <button className="" onClick={close}>✖</button>

        {!selectedCategory ? (
          <>
            <h2 className="popupTitle">בחר קטגוריה</h2>
            <div className="categoriesGrid">
              {categories.map((category, index) => (
                <div key={index} className="categoryBox" onClick={() => setSelectedCategory(category)}>
                  {category.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="popupHeader">
              <button onClick={handleBack} className="backBtn">⬅ חזרה</button>
              <h2 className="popupTitle">{selectedCategory.name}</h2>
            </div>
            <div className="categoriesGrid">
              {selectedCategory.items.map((item, index) => (
                <div key={index} className="categoryBox" onClick={() => handleItemClick(item)}>
                  {item}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderPopUp;
