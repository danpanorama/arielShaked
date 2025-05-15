import { useSelector, useDispatch } from "react-redux";
import "../../css/cart.css"; // קובץ CSS חדש
import PrimaryButton from "../btn/PrimaryButton";
import { setShowCart } from "../../redux/cartSlice";

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
            className="cartTriggerButton"
          >
            הצג עגלה (
            {cart.reduce((acc, curr) => acc + curr.items.length, 0)} )
          </button>

          {showCart && (
            <div className="cartModalOverlay">
              <div className="cartModalContent">
                <button
                  className="cartCloseButton"
                  onClick={() => dispatch(setShowCart(false))}
                >
                  ✖
                </button>
                <h3 className="cartTitle">העגלה שלך:</h3>

                {cart.map((providerCart) => (
                  <div key={providerCart.providerId} className="cartProvider">
                    <h4 className="cartProviderName">{providerCart.providerId}</h4>
                    <ul className="cartItemList">
                      {providerCart.items.map((item, idx) => (
                        <li key={idx} className="cartItem">
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
