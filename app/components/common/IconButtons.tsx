import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

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
        backgroundColor: backgroundColor,
      }}
    >
      <AntDesign
        name="delete"
        size={size}
        color={color}
        style={styles.deleteButton}
      />
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
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
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
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
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
};

export const DefaultButton = ({
  text,
  disabled,
  isLoading,
}: DefaultButtonPropsType) => {
  const mixedStyles = { ...styles.button };
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
    borderRadius: 30,
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
