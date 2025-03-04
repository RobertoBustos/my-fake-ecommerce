import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

export type ProductFooterPropsType = {
  onClick: () => void;
  disabled: boolean;
};
const ProductFooter = ({ onClick, disabled }: ProductFooterPropsType) => {
  return (
    <CustomFooter>
      <FooterButton
        text={"Add to Cart"}
        onPress={onClick}
        disabled={disabled}
      />
    </CustomFooter>
  );
};

export default ProductFooter;
