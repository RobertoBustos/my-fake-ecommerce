import { PropsWithChildren, createContext, useContext } from "react";
import { Alert } from "react-native";
import { CartItemType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import useOrder from "../hooks/useOrder";
import {
  selectCartId,
  selectCartItems,
  selectIsCartEmpty,
} from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import { selectSelectedOrderId } from "../redux/order/selectors";

export type CartContextType = {
  cartItems: CartItemType[];
  isCartEmpty: boolean;
  isCreating: boolean;
  processCart: () => void;
  orderId: string | undefined;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  isCartEmpty: false,
  isCreating: false,
  processCart: () => {},
  orderId: undefined,
});

const CartStore = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const cartItems = useAppSelector(selectCartItems);
  const isCartEmpty = useAppSelector(selectIsCartEmpty);
  const orderId = useAppSelector(selectSelectedOrderId);
  const cartId = useAppSelector(selectCartId);
  const { createNewOrder, isCreating } = useOrder();

  const processCart = () => {
    if (isCartEmpty) {
      navigation.goBack();
      return;
    }
    if (!orderId) {
      createNewOrder({ cartId: cartId })
        .then((data) => {
          dispatch(setSelectedOrderId(data.id));
          navigation.navigate("Checkout");
          return;
        })
        .catch((error) => Alert.alert(error));
    }
    if (orderId) {
      navigation.navigate("Checkout");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, isCartEmpty, isCreating, processCart, orderId }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};

export default CartStore;
