import { useOrderContext } from "@/app/contexts/OrderContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ConfirmationFooter = () => {
  const { returnFromConfirmation, footerText } = useOrderContext();

  const handleReturnHome = () => {
    returnFromConfirmation();
  };

  return (
    <CustomFooter>
      <FooterButton text={footerText} onPress={handleReturnHome} />
    </CustomFooter>
  );
};

export default ConfirmationFooter;
