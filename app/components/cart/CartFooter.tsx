import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

export type CartFooterPropsType = {
  text: string;
  onClick: () => void;
};

const CartFooter = ({ text, onClick }: CartFooterPropsType) => {
  return (
    <CustomFooter>
      <FooterButton text={text} onPress={onClick} />
    </CustomFooter>
  );
};

export default CartFooter;
