import { Alert } from "react-native";
import { useCartContext } from "../../contexts/CartContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createOrder } from "../../redux/order/reducer";
import {
  selectIsOrderLoading,
  selectOrderData,
} from "../../redux/order/selectors";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CartFooter = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsOrderLoading);
  const orderData = useAppSelector(selectOrderData);
  const { cart, cartSummary, createCartSummary } = useCartContext();
  const navigation = useAppNavigation();
  const isCartEmpty = cart.length === 0;

  const handleRedirect = () => {
    if (isCartEmpty) {
      navigation.goBack();
      return;
    }
    createCartSummary();
    if (orderData === null || orderData.orderId === null) {
      dispatch(createOrder({ items: cart, summary: cartSummary }))
        .unwrap()
        .then(() => {
          navigation.navigate("Checkout");
        })
        .catch(() => {
          Alert.alert("Unable to process order");
        });
      return;
    }
    navigation.navigate("Checkout");
  };

  const footerText = isCartEmpty ? "Return to Products" : "Proceed to Payment";

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
