import { useSelector, useDispatch } from "react-redux";
import "../../css/cart.css";
import "../../css/popup.css";
import PrimaryButton from "../btn/PrimaryButton";
import { setShowCart } from "../../redux/cartSlice"; // ודא שזה קיים אצלך

function Cart({ sendOrder }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const showCart = useSelector((state) => state.cart.showCart);

  return (
    <div>
      {cart.length > 0 && (
        <>
          <button
            onClick={() => dispatch(setShowCart(true))}
            className="viewCartBtn"
          >
            הצג עגלה (
            {cart.reduce((acc, curr) => acc + curr.items.length, 0)})
          </button>

          {showCart && (
            <div className="cartPopup">
              <div className="cartContent">
                <button
                  className="closeBtn"
                  onClick={() => dispatch(setShowCart(false))}
                >
                  ✖
                </button>
                <h3>העגלה שלך:</h3>
                {cart.map((providerCart) => (
                  <div key={providerCart.providerId}>
                    <h4>{providerCart.providerId}</h4>
                    <ul>
                      {providerCart.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} - {item.quantity} יחידות
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <PrimaryButton click={sendOrder} text="שלח הזמנה" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
