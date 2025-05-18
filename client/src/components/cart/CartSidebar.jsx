import "../../css/cartSidebar.css";

function CartSidebar({ cart }) {
  // קיבוץ מוצרים לפי קטגוריה
  const groupedByCategory = cart.reduce((acc, item) => {
    const category = item.category || "ללא קטגוריה";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const handleSendOrder = () => {
    alert("שליחת ההזמנה (הפונקציונליות טרם ממומשת)");
  };

  return (
    <div className="orderCartSidebar">
      <h3 className="orderCartTitle">העגלה שלך</h3>

      {cart.length === 0 ? (
        <p className="orderCartEmpty">העגלה ריקה</p>
      ) : (
        <>
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category} className="orderCartCategory">
              <h4 className="orderCartCategoryTitle">{category}</h4>
              <ul className="orderCartList">
                {items.map((item) => (
                  <li key={item.id} className="orderCartItem">
                    <span className="orderCartItemName">{item.name}</span>
                    <span className="orderCartItemQty">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button className="orderCartSubmitBtn" onClick={handleSendOrder}>
            שלח הזמנה
          </button>
        </>
      )}
    </div>
  );
}

export default CartSidebar;
