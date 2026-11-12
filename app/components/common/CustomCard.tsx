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

  if (isLoading) return null;

  const card = (
    <View style={mixedStyles} testID={onPress ? undefined : testID}>
      {headerText ? (
        <CustomCardHeader
          text={headerText}
          style={styles}
          showEditLabel={showEditLabel}
        />
      ) : null}
      <View style={mixedContentStyles}>{children}</View>
    </View>
  );

  // A touchable is a single accessibility element on iOS and hides the testID of
  // everything inside it, so a card without onPress (the forms) is a plain View
  if (!onPress) return card;

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      {card}
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
