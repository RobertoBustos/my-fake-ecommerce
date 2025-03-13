import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { GLOBAL_THEME_BORDER_RADIUS, colors } from "../../constants/colors";

export type IconButtonPropsType = {
  size?: number;
  color?: string;
  backgroundColor?: string;
};

export const DeleteButton = ({
  size = 30,
  color = colors.black,
  backgroundColor = colors.white,
}: IconButtonPropsType) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        backgroundColor: backgroundColor,
      }}
    >
      <FontAwesome name="remove" size={size} color={color} />
    </View>
  );
};

export const PlusButton = ({
  size = 30,
  color = colors.black,
  backgroundColor = colors.white,
}: IconButtonPropsType) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor,
        width: 100,
        height: 50,
        borderTopRightRadius: GLOBAL_THEME_BORDER_RADIUS,
        borderBottomRightRadius: GLOBAL_THEME_BORDER_RADIUS,
      }}
    >
      <FontAwesome name="plus" size={size} color={color} />
    </View>
  );
};

export const MinusButton = ({
  size = 30,
  color = colors.black,
  backgroundColor = colors.white,
}: IconButtonPropsType) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor,
        width: 100,
        height: 50,
        borderTopLeftRadius: GLOBAL_THEME_BORDER_RADIUS,
        borderBottomLeftRadius: GLOBAL_THEME_BORDER_RADIUS,
      }}
    >
      <FontAwesome name="minus" size={size} color={color} />
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
  const mixedStyles: StyleProp<ViewStyle> = { ...styles.button };

  if (backgroundColor) {
    mixedStyles.backgroundColor = backgroundColor;
  }

  if (disabled || isLoading) {
    mixedStyles.backgroundColor = colors.dark;
  }
  return (
    <View style={mixedStyles}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.white}
          style={styles.loader}
        />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: GLOBAL_THEME_BORDER_RADIUS,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
  loader: {
    flex: 1,
  },
});

export default DefaultButton;
