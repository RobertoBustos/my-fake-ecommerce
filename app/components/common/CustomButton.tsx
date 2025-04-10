import { ReactNode } from "react";
import { TouchableHighlight } from "react-native";

export type CustomButtonPropsType = {
  onPress: () => void;
  buttonComponent: ReactNode;
  disabled?: boolean;
  testID?: string;
};

const CustomButton = ({
  onPress,
  buttonComponent,
  disabled,
  testID,
}: CustomButtonPropsType) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      underlayColor={"transparent"}
      testID={testID}
    >
      {buttonComponent}
    </TouchableHighlight>
  );
};

export default CustomButton;
