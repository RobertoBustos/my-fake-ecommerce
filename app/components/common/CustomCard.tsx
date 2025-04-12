import customCardStyleSheet from "@/app/styles/components/CustomCard";
import { PropsWithChildren } from "react";
import {
  StyleProp,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useStyles } from "react-native-unistyles";

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
  const { styles, theme } = useStyles(customCardStyleSheet);
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.container };
  const mixedContentStyles: StyleProp<ViewStyle> = { ...styles.content };

  if (variant === "warning") {
    mixedStyles.backgroundColor = theme.colors.warning;
  }

  if (orientation === "vertical") {
    mixedContentStyles.flexDirection = "column";
  }

  return isLoading ? null : (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      <View style={mixedStyles}>
        {headerText ? (
          <Text style={styles.headerText}>{headerText}</Text>
        ) : null}
        <View style={mixedContentStyles}>{children}</View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomCard;
