import { useCallback } from "react";
import { useOrderContext } from "../../contexts/OrderContext";
import useAppNavigation from "../../hooks/useAppNavigation";
import { resetCart } from "../../redux/cart/reducer";
import { useAppDispatch } from "../../redux/hooks";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ConfirmationFooter = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { isUpdating, orderData, leaveCheckout } = useOrderContext();
  const orderStatus = orderData?.status;

  const handleReturnHome = useCallback(() => {
    if (orderStatus !== "complete") {
      leaveCheckout();
      return;
    }
    dispatch(resetCart());
    navigation.reset({ index: 0, routes: [{ name: "Products" }] });
  }, [dispatch, leaveCheckout, navigation, orderStatus]);

  const footerText = orderStatus !== "complete" ? "Go Back" : "Return to Home";
  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleReturnHome}
        isLoading={isUpdating}
        disabled={isUpdating}
      />
    </CustomFooter>
  );
};

export default ConfirmationFooter;
