import { useCartContext } from "@/app/contexts/CartContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CartFooter = () => {
  const { processCart, footerText, isLoading } = useCartContext();

  const handleRedirect = () => {
    processCart();
  };

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleRedirect}
        isLoading={isLoading}
        disabled={isLoading}
        testID="CartScreen.Footer"
      />
    </CustomFooter>
  );
};

export default CartFooter;
