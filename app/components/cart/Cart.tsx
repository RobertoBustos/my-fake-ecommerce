import { useCartContext } from "../../contexts/CartContext";
import CartList from "../CartList";
import EmptyCart from "../EmptyCart";
import CartHeader from "./CartHeader";

const Cart = () => {
  const { cart } = useCartContext();
  const isCartEmpty = cart.length === 0;
  return isCartEmpty ? (
    <EmptyCart />
  ) : (
    <>
      <CartHeader />
      <CartList cartItems={cart} />
    </>
  );
};

export default Cart;
