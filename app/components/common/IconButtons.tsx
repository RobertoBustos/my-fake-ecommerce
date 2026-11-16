import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ColorValue, StyleProp, Text, View, ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import defaultButtonStyleSheet from "../../styles/components/DefaultButton";
import deleteButtonStyleSheet from "../../styles/components/DeleteButton";
import minusButtonStyleSheet from "../../styles/components/MinusButton";
import plusButtonStyleSheet from "../../styles/components/PlusButton";
import reloadButtonStyleSheet from "../../styles/components/ReloadButton";
import LoadingSpinner from "../LoadingSpinner";

export type IconButtonPropsType = {
  size?: number;
  color?: string;
  disabled?: boolean;
};

export const DeleteButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const styles = deleteButtonStyleSheet;
  const { theme } = useUnistyles();
  // Unistyles 3 styles can't be spread, so the override goes in an array
  const mixedStyles: StyleProp<ViewStyle> = [
    styles.button,
    disabled && { backgroundColor: theme.colors.disabled },
  ];

  return (
    <View style={mixedStyles}>
      <FontAwesome name="remove" size={size} color={theme.colors.error} />
    </View>
  );
};

export const PlusButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const styles = plusButtonStyleSheet;
  const { theme } = useUnistyles();
  // Unistyles 3 styles can't be spread, so the override goes in an array
  const mixedStyles: StyleProp<ViewStyle> = [
    styles.button,
    disabled && { backgroundColor: theme.colors.disabled },
  ];

  return (
    <View style={mixedStyles}>
      <FontAwesome name="plus" size={size} color={theme.colors.onPrimary} />
    </View>
  );
};

export const MinusButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const styles = minusButtonStyleSheet;
  const { theme } = useUnistyles();
  // Unistyles 3 styles can't be spread, so the override goes in an array
  const mixedStyles: StyleProp<ViewStyle> = [
    styles.button,
    disabled && { backgroundColor: theme.colors.disabled },
  ];

  return (
    <View style={mixedStyles}>
      <FontAwesome name="minus" size={size} color={theme.colors.onPrimary} />
    </View>
  );
};

export const ReloadButton = ({ size = 30, disabled }: IconButtonPropsType) => {
  const styles = reloadButtonStyleSheet;
  const { theme } = useUnistyles();
  // Unistyles 3 styles can't be spread, so the override goes in an array
  const mixedStyles: StyleProp<ViewStyle> = [
    styles.button,
    disabled && { backgroundColor: theme.colors.disabled },
  ];
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
  const styles = defaultButtonStyleSheet;
  const { theme } = useUnistyles();
  // Unistyles 3 styles can't be spread, so the overrides go in an array.
  // The disabled color wins over a custom one
  const mixedStyles: StyleProp<ViewStyle> = [
    styles.button,
    backgroundColor && { backgroundColor },
    (disabled || isLoading) && { backgroundColor: theme.colors.disabled },
  ];

  return (
    <View style={mixedStyles}>
      {isLoading ? (
        <LoadingSpinner size="small" color={theme.colors.onPrimary} />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </View>
  );
};

export default DefaultButton;
