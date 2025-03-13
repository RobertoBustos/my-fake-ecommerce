import { setCompleteStatus } from "@/app/redux/order/reducer";
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
  const { isUpdating, orderData } = useOrderContext();

  const handleReturnHome = useCallback(() => {
    if (!orderData) return;
    dispatch(resetCart());
    dispatch(setCompleteStatus(orderData.orderId));
    navigation.reset({ index: 0, routes: [{ name: "Products" }] });
  }, [dispatch, navigation, orderData]);

  const footerText = "Return to Home";
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
