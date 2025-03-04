import FooterButton from "../FooterButton";

export type CartFooterPropsType = {
  text: string;
  onClick: () => void;
};

const CartFooter = ({ text, onClick }: CartFooterPropsType) => {
  return <FooterButton text={text} onPress={onClick} />;
};

export default CartFooter;
