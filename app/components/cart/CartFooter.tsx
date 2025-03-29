import { useCartContext } from "@/app/contexts/CartContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CartFooter = () => {
  const { processCart, isCartEmpty, isCreating, orderId } = useCartContext();

  const handleRedirect = () => {
    processCart();
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
