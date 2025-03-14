import { useOrderContext } from "../../contexts/OrderContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ConfirmationFooter = () => {
  const { isUpdating, returnFromConfirmation } = useOrderContext();

  const handleReturnHome = () => {
    returnFromConfirmation();
  };

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
