import { PropsWithChildren } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { GLOBAL_THEME_BORDER_RADIUS, colors } from "../../constants/colors";
import FormSkeleton from "../skeletons/FormSkeleton";

export type CustomCardPropsType = PropsWithChildren & {
  onPress?: () => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  variant?: "warning" | "error" | "info";
  headerText?: string;
  isLoading?: boolean;
  testID?: string;
};

const CustomCard = ({
  children,
  onPress,
  disabled,
  orientation = "vertical",
  variant,
  headerText,
  isLoading,
  testID,
}: CustomCardPropsType) => {
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.container };
  const direction = orientation === "vertical" ? "column" : "row";

  if (variant === "warning") {
    mixedStyles.backgroundColor = colors.warning;
  }

  return isLoading ? (
    <FormSkeleton rows={1} rowHeight={80} />
  ) : (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      <View style={mixedStyles}>
        {headerText ? (
          <Text style={styles.headerText}>{headerText}</Text>
        ) : null}
        <View style={{ flexDirection: direction }}>{children}</View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.white,
    justifyContent: "space-between",
    marginVertical: 8,
    borderRadius: GLOBAL_THEME_BORDER_RADIUS,
    padding: 8,
    //shadows
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: GLOBAL_THEME_BORDER_RADIUS * 0.1,
    elevation: 8,
  },
  headerText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    marginBottom: 8,
  },
});

export default CustomCard;
