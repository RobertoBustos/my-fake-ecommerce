import FooterButton from "../FooterButton";

export type ConfirmationFooterPropsType = {
  onClick: () => void;
};

const ConfirmationFooter = ({ onClick }: ConfirmationFooterPropsType) => {
  return <FooterButton text={"Return To Home"} onPress={onClick} />;
};

export default ConfirmationFooter;
