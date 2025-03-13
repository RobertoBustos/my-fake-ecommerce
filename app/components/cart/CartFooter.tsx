import { selectIsCartEmpty } from "@/app/redux/cart/selectors";
import useAppNavigation from "../../hooks/useAppNavigation";
import { resetCart } from "../../redux/cart/reducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createOrder, updateOrderItems } from "../../redux/order/reducer";
import {
  selectIsUpdating,
  selectSelectedOrderId,
} from "../../redux/order/selectors";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CartFooter = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const orderId = useAppSelector(selectSelectedOrderId);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isCartEmpty = useAppSelector(selectIsCartEmpty);

  const handleRedirect = () => {
    if (isCartEmpty) {
      navigation.goBack();
      return;
    }
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

  const footerText = isCartEmpty
    ? "Go Back"
    : orderId
    ? "Update Order"
    : "Go to Checkout";

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleRedirect}
        isLoading={isUpdating}
        disabled={isUpdating}
      />
    </CustomFooter>
  );
};

export default CartFooter;
