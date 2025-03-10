import { Alert } from "react-native";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { selectIsCartEmpty } from "../../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createOrder, updateOrderItems } from "../../redux/order/reducer";
import {
  selectIsOrderComplete,
  selectIsOrderLoading,
  selectOrderData,
} from "../../redux/order/selectors";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CartFooter = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsOrderLoading);
  const orderData = useAppSelector(selectOrderData);
  const navigation = useAppNavigation();
  const isCartEmpty = useAppSelector(selectIsCartEmpty);
  const isOrderComplete = useAppSelector(selectIsOrderComplete);

  const handleRedirect = () => {
    if (isCartEmpty) {
      navigation.goBack();
      return;
    }
    if (orderData === null) {
      dispatch(createOrder())
        .unwrap()
        .then(() => {
          navigation.navigate("Checkout");
          return;
        })
        .catch(() => {
          Alert.alert("Unable to process order");
          return;
        });
    }
    if (isOrderComplete) {
      navigation.navigate("Checkout");
    }
    dispatch(updateOrderItems())
      .unwrap()
      .then((result) => {
        if (result) {
          navigation.navigate("Checkout");
        }
      });
  };

  const footerText = isCartEmpty
    ? "Return to Products"
    : isOrderComplete
    ? "Go to Checkout"
    : "Proceed to Payment";

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleRedirect}
        isLoading={isLoading}
      />
    </CustomFooter>
  );
};

export default CartFooter;
