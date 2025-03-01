import { ReactNode } from "react";
import { TouchableHighlight } from "react-native";

export type CustomButtonPropsType = {
  onPress: () => void;
  buttonComponent: ReactNode;
  disabled?: boolean;
};

const CustomButton = ({
  onPress,
  buttonComponent,
  disabled,
}: CustomButtonPropsType) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      underlayColor={"transparent"}
    >
      {buttonComponent}
    </TouchableHighlight>
  );
};

export default CustomButton;
