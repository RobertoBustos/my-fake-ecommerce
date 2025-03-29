import useCart from "@/app/hooks/useCart";
import { useAppSelector } from "../../redux/hooks";
import { selectSelectedOrderId } from "../../redux/order/selectors";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

export type ProductFooterPropsType = {
  onClick: () => void;
  disabled: boolean;
};
const ProductFooter = ({ onClick, disabled }: ProductFooterPropsType) => {
  const orderId = useAppSelector(selectSelectedOrderId);
  const { isAdding, isRemoving } = useCart();
  const footerText = orderId ? "Add to Order" : "Add to Cart";

  return (
    <CustomFooter>
      <FooterButton
        text={footerText}
        onPress={onClick}
        disabled={disabled || isAdding || isRemoving}
        isLoading={isAdding || isRemoving}
      />
    </CustomFooter>
  );
};

export default ProductFooter;
