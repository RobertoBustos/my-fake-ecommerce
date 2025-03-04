import { useCartContext } from "@/app/contexts/CartContext";
import CartList from "../CartList";
import EmptyCart from "../EmptyCart";
import CartHeader from "./CartHeader";

const Cart = () => {
  const { cart } = useCartContext();
  const isCartEmpty = cart.items.length === 0;
  return isCartEmpty ? (
    <EmptyCart />
  ) : (
    <>
      <CartHeader />
      <CartList cartItems={cart.items} />
    </>
  );
};

export default Cart;
