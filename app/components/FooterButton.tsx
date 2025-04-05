import CustomButton from "./common/CustomButton";
import DefaultButton from "./common/IconButtons";

export type FooterButtonPropsType = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  testID?: string;
};

const FooterButton: React.FC<FooterButtonPropsType> = ({
  text,
  onPress,
  disabled,
  isLoading,
  testID,
}) => {
  return (
    <CustomButton
      onPress={onPress}
      buttonComponent={
        <DefaultButton text={text} disabled={disabled} isLoading={isLoading} />
      }
      disabled={disabled || isLoading}
      testID={testID}
    />
  );
};

export default FooterButton;
