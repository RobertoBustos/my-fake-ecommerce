import { useProductContext } from "../../contexts/ProductContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ProductFooter = () => {
  const { isAdding, addProductToCart, isDisabled, footerText } =
    useProductContext();

  const handleClick = () => {
    addProductToCart();
  };

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={handleClick}
        disabled={isDisabled}
        isLoading={isAdding}
        testID="ProductScreen.Footer"
      />
    </CustomFooter>
  );
};

export default ProductFooter;
