import { useSelector, useDispatch } from "react-redux";
import "../../css/popup.css";

const CartPopup = ({ close }) => {
  const cart = useSelector(state => state.providerCart.items);
  const total = useSelector(state => state.providerCart.total);
  const dispatch = useDispatch();

  return (
    <div className="cartPopupOverlay">
        <br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div className="cartPopupContainer">
        <button onClick={close} className="closeBtn">✖</button>
        <h2>העגלה שלי</h2>
        {cart.length === 0 ? (
          <p>העגלה ריקה</p>
        ) : (
          <>
            <ul>
              {cart.map((item, i) => (
                <li key={i}>
                  {item.name} - {item.quantity} יחידות
                  <br />
                  <button onClick={() => dispatch({ type: 'DECREASE_ITEM', payload: { id: item.id, amount: 10 } })}>-10</button>
                  <button onClick={() => dispatch({ type: 'DECREASE_ITEM', payload: { id: item.id, amount: 100 } })}>-100</button>
                  <button onClick={() => dispatch({ type: 'DECREASE_ITEM', payload: { id: item.id, amount: 500 } })}>-500</button>
                  <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}>הסר</button>
                </li>
              ))}
            </ul>
            <h3>סה״כ: ₪{total}</h3>
            <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>נקה עגלה</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
