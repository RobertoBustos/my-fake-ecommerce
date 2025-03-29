import { useCartContext } from "@/app/contexts/CartContext";
import CartList from "../CartList";
import EmptyCart from "../EmptyCart";
import CartHeader from "./CartHeader";

const Cart = () => {
  const { isCartEmpty } = useCartContext();

  return isCartEmpty ? (
    <EmptyCart />
  ) : (
    <>
      <CartHeader />
      <CartList />
    </>
  );
};

export default Cart;
