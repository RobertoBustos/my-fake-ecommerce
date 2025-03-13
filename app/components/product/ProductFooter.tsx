import { useAppSelector } from "@/app/redux/hooks";
import { selectSelectedOrderId } from "@/app/redux/order/selectors";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

export type ProductFooterPropsType = {
  onClick: () => void;
  disabled: boolean;
};
const ProductFooter = ({ onClick, disabled }: ProductFooterPropsType) => {
  const orderId = useAppSelector(selectSelectedOrderId);

  const footerText = orderId ? "Add to Order" : "Add to Cart";

  return (
    <CustomFooter>
      <FooterButton text={footerText} onPress={onClick} disabled={disabled} />
    </CustomFooter>
  );
};

export default ProductFooter;
