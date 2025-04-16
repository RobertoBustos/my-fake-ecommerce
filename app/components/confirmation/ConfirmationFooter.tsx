import { useOrderContext } from "../../contexts/OrderContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ConfirmationFooter = () => {
  const { returnFromConfirmation, footerText } = useOrderContext();

  const handleReturnHome = () => {
    returnFromConfirmation();
  };

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleReturnHome}
        testID="ConfirmationScreen.Footer"
      />
    </CustomFooter>
  );
};

export default ConfirmationFooter;
