import AntDesign from "@expo/vector-icons/AntDesign";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export type IconButtonPropsType = {
  size?: number;
  color?: string;
};

export const DeleteButton = ({
  size = 30,
  color = "black",
}: IconButtonPropsType) => {
  return (
    <AntDesign
      name="delete"
      size={size}
      color={color}
      style={styles.deleteButton}
    />
  );
};

export const AddButton = ({
  size = 30,
  color = "black",
}: IconButtonPropsType) => {
  return <AntDesign name="pluscircle" size={size} color={color} />;
};

export const SubstractButton = ({
  size = 30,
  color = "black",
}: IconButtonPropsType) => {
  return <AntDesign name="minuscircle" size={size} color={color} />;
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
    mixedStyles.backgroundColor = "darkgray";
  }
  return (
    <View style={mixedStyles}>
      {isLoading ? (
        <ActivityIndicator size="small" color={"white"} style={styles.loader} />
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
    backgroundColor: "teal",
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
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
