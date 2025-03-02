import { PropsWithChildren } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

export type CustomCardPropsType = PropsWithChildren & {
  onPress?: () => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
};

const CustomCard = ({
  children,
  onPress,
  disabled,
  orientation = "vertical",
}: CustomCardPropsType) => {
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.container };
  mixedStyles.flexDirection = orientation === "vertical" ? "column" : "row";

  return (
    <TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
      <View style={mixedStyles}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "space-between",
    marginVertical: 8,
    borderRadius: 8,
    padding: 8,
    //shadows
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
});

export default CustomCard;
