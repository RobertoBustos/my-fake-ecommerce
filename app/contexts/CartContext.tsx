import { PropsWithChildren, createContext, useContext } from "react";
import { Alert } from "react-native";
import { CartItemType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import useCart from "../hooks/useCart";
import useOrder from "../hooks/useOrder";
import {
  removeItemFromCart,
  setSelectedProductId,
} from "../redux/cart/reducer";
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
  isLoading: boolean;
  processCart: () => void;
  removeFromCart: (id: string) => void;
  redirectToProduct: (id: string) => void;
  orderId: string | undefined;
  footerText: string;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  isCartEmpty: false,
  isLoading: false,
  processCart: () => {},
  removeFromCart: (id: string) => {},
  redirectToProduct: (id: string) => {},
  orderId: undefined,
  footerText: "",
});

const CartStore = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const cartItems = useAppSelector(selectCartItems);
  const isCartEmpty = useAppSelector(selectIsCartEmpty);
  const orderId = useAppSelector(selectSelectedOrderId);
  const cartId = useAppSelector(selectCartId);
  const { createNewOrder, isCreating } = useOrder();
  const { removeProduct, isRemoving } = useCart();
  const isLoading = isCreating || isRemoving;
  const footerText = isCartEmpty
    ? "Go Back"
    : orderId
    ? "Update Order"
    : "Create Order";

  const processCart = () => {
    if (isCartEmpty) {
      navigation.goBack();
      return;
    }
    if (!orderId) {
      createNewOrder({ cartId: cartId })
        .then((data) => {
          dispatch(setSelectedOrderId(data.id));
          navigation.navigate("Address", { orderId: data.id });
          return;
        })
        .catch((error) => Alert.alert(error));
    }
    if (orderId) {
      navigation.navigate("Address", { orderId });
    }
  };

  const removeFromCart = (cartItemId: string) => {
    Alert.alert("Remove this item from cart?", "", [
      {
        text: "OK",
        onPress: () =>
          removeProduct({ id: cartItemId }).then(() =>
            dispatch(removeItemFromCart(cartItemId))
          ),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  const redirectToProduct = (productId: string) => {
    dispatch(setSelectedProductId(productId));
    navigation.navigate("Product", { productId });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartEmpty,
        isLoading,
        processCart,
        removeFromCart,
        redirectToProduct,
        orderId,
        footerText,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};

export default CartStore;
