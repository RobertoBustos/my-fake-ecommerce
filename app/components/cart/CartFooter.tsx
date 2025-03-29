import useOrder from "@/app/hooks/useOrder";
import { setSelectedOrderId } from "@/app/redux/order/reducer";
import { Alert } from "react-native";
import useAppNavigation from "../../hooks/useAppNavigation";
import { selectCartId, selectIsCartEmpty } from "../../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectSelectedOrderId } from "../../redux/order/selectors";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CartFooter = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const orderId = useAppSelector(selectSelectedOrderId);
  const isCartEmpty = useAppSelector(selectIsCartEmpty);
  const cartId = useAppSelector(selectCartId);
  const { createNewOrder, isCreating } = useOrder();

  const handleRedirect = () => {
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

  const footerText = isCartEmpty
    ? "Go Back"
    : orderId
    ? "Update Order"
    : "Create Order";

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleRedirect}
        isLoading={isCreating}
        disabled={isCreating}
      />
    </CustomFooter>
  );
};

export default CartFooter;
