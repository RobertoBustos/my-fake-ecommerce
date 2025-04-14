import { PropsWithChildren } from "react";
import {
  StyleProp,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useStyles } from "react-native-unistyles";
import customCardStyleSheet from "../../styles/components/CustomCard";

export type CustomCardPropsType = PropsWithChildren & {
  onPress?: () => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  variant?: "warning" | "error" | "info";
  headerText?: string;
  isLoading?: boolean;
  testID?: string;
  showEditLabel?: boolean;
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
  showEditLabel,
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
          <CustomCardHeader
            text={headerText}
            style={styles}
            showEditLabel={showEditLabel}
          />
        ) : null}
        <View style={mixedContentStyles}>{children}</View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomCard;

export type CustomCardHeaderPropsType = {
  text: string;
  style: StyleProp<any>;
  showEditLabel?: boolean;
};

const CustomCardHeader = ({
  text,
  style,
  showEditLabel,
}: CustomCardHeaderPropsType) => {
  return (
    <View style={style.headerContainer}>
      <Text style={style.headerText}>{text}</Text>
      {showEditLabel ? (
        <Text style={style.editLabel}>{"Press to edit"}</Text>
      ) : null}
    </View>
  );
};
