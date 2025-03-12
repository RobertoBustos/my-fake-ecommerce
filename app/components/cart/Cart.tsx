import { selectCartItems, selectIsCartEmpty } from "../../redux/cart/selectors";
import { useAppSelector } from "../../redux/hooks";
import CartList from "../CartList";
import EmptyCart from "../EmptyCart";
import CartHeader from "./CartHeader";

const Cart = () => {
  const cartItems = useAppSelector(selectCartItems);
  const isCartEmpty = useAppSelector(selectIsCartEmpty);

  return isCartEmpty ? (
    <EmptyCart />
  ) : (
    <>
      <CartHeader />
      <CartList cartItems={cartItems} />
    </>
  );
};

export default Cart;
