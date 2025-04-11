import { useOrderContext } from "../../contexts/OrderContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CheckoutFooter = () => {
  const { footerText, processCheckout, isProcessing, isDisabled } =
    useOrderContext();

  const handleClick = () => {
    processCheckout();
  };

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleClick}
        isLoading={isProcessing}
        disabled={isDisabled || isProcessing}
        testID="CheckoutScreen.Footer"
      />
    </CustomFooter>
  );
};

export default CheckoutFooter;
