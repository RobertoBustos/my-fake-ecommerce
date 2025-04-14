import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useStyles } from "react-native-unistyles";
import defaultButtonStyleSheet from "../../styles/components/DefaultButton";
import deleteButtonStyleSheet from "../../styles/components/DeleteButton";
import minusButtonStyleSheet from "../../styles/components/MinusButton";
import plusButtonStyleSheet from "../../styles/components/PlusButton";
import reloadButtonStyleSheet from "../../styles/components/ReloadButton";

export type IconButtonPropsType = {
  size?: number;
  color?: string;
  disabled?: boolean;
};

export const DeleteButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const { styles, theme } = useStyles(deleteButtonStyleSheet);
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.button };

  if (disabled) {
    mixedStyles.backgroundColor = theme.colors.disabled;
  }

  return (
    <View style={mixedStyles}>
      <FontAwesome name="remove" size={size} color={theme.colors.error} />
    </View>
  );
};

export const PlusButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const { styles, theme } = useStyles(plusButtonStyleSheet);
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.button };

  if (disabled) {
    mixedStyles.backgroundColor = theme.colors.disabled;
  }

  return (
    <View style={mixedStyles}>
      <FontAwesome name="plus" size={size} color={theme.colors.onPrimary} />
    </View>
  );
};

export const MinusButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const { styles, theme } = useStyles(minusButtonStyleSheet);
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.button };

  if (disabled) {
    mixedStyles.backgroundColor = theme.colors.disabled;
  }

  return (
    <View style={mixedStyles}>
      <FontAwesome name="minus" size={size} color={theme.colors.onPrimary} />
    </View>
  );
};

export const ReloadButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const { styles, theme } = useStyles(reloadButtonStyleSheet);
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.button };

  if (disabled) {
    mixedStyles.backgroundColor = theme.colors.disabled;
  }
  return (
    <View style={mixedStyles}>
      <FontAwesome name="refresh" size={size} color={theme.colors.typography} />
      <Text style={styles.buttonText}>RETRY</Text>
    </View>
  );
};

export type DefaultButtonPropsType = {
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
  backgroundColor?: ColorValue;
};

const DefaultButton = ({
  text,
  disabled,
  isLoading,
  backgroundColor,
}: DefaultButtonPropsType) => {
  const { styles, theme } = useStyles(defaultButtonStyleSheet);
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.button };

  if (backgroundColor) {
    mixedStyles.backgroundColor = backgroundColor;
  }

  if (disabled || isLoading) {
    mixedStyles.backgroundColor = theme.colors.disabled;
  }

  return (
    <View style={mixedStyles}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.onPrimary}
          style={styles.loader}
        />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </View>
  );
};

export default DefaultButton;
