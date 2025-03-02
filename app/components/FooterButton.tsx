import CustomButton from "./common/CustomButton";
import { DefaultButton } from "./common/IconButtons";

export type FooterButtonPropsType = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const FooterButton: React.FC<FooterButtonPropsType> = ({
  text,
  onPress,
  disabled,
  isLoading,
}) => {
  return (
    <CustomButton
      onPress={onPress}
      buttonComponent={
        <DefaultButton text={text} disabled={disabled} isLoading={isLoading} />
      }
      disabled={disabled || isLoading}
    />
  );
};

export default FooterButton;
