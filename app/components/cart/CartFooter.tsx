import useAppNavigation from "../../hooks/useAppNavigation";
import { resetCart } from "../../redux/cart/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createOrder, updateOrderItems } from "../../redux/order/reducer";
import {
  selectIsOrderLoading,
  selectSelectedOrderId,
} from "../../redux/order/selectors";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CartFooter = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const orderId = useAppSelector(selectSelectedOrderId);
  const isLoading = useAppSelector(selectIsOrderLoading);

  const handleRedirect = () => {
    if (!orderId) {
      dispatch(createOrder())
        .unwrap()
        .then((response) => {
          dispatch(resetCart());
          navigation.navigate("Checkout");
          return;
        });
      return;
    }
    if (orderId) {
      dispatch(updateOrderItems(orderId))
        .unwrap()
        .then((result) => {
          if (result) {
            navigation.navigate("Checkout");
          }
        });
    }
  };

  const footerText = orderId ? "Update Order" : "Go to Checkout";

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleRedirect}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </CustomFooter>
  );
};

export default CartFooter;
