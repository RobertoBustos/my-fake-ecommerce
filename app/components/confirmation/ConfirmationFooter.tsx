import useAppNavigation from "@/app/hooks/useAppNavigation";
import { resetCart } from "@/app/redux/cart/reducer";
import { useAppDispatch } from "@/app/redux/hooks";
import { setSelectedOrderId } from "@/app/redux/order/reducer";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ConfirmationFooter = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleReturnHome = () => {
    dispatch(resetCart());
    dispatch(setSelectedOrderId(undefined));
    navigation.reset({
      index: 0,
      routes: [{ name: "Products" }],
    });
    return;
  };

  const footerText = "Return to Home";
  return (
    <CustomFooter>
      <FooterButton text={footerText} onPress={handleReturnHome} />
    </CustomFooter>
  );
};

export default ConfirmationFooter;
