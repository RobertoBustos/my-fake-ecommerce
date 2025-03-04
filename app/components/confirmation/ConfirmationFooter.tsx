import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

export type ConfirmationFooterPropsType = {
  onClick: () => void;
};

const ConfirmationFooter = ({ onClick }: ConfirmationFooterPropsType) => {
  return (
    <CustomFooter>
      <FooterButton text={"Return To Home"} onPress={onClick} />
    </CustomFooter>
  );
};

export default ConfirmationFooter;
