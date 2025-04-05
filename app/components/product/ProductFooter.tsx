import { useProductContext } from "@/app/contexts/ProductContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ProductFooter = () => {
  const { isAdding, addProductToCart, data, cartId, orderId } =
    useProductContext();

  const handleClick = () => {
    addProductToCart();
  };

  const footerText = orderId ? "Add to Order" : "Add to Cart";

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleClick}
        disabled={data?.stock === 0 || cartId === "" || isAdding}
        isLoading={isAdding}
        testID="productFooterButton"
      />
    </CustomFooter>
  );
};

export default ProductFooter;
