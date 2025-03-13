import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export type OrderNotAllowedScreenPropsType = {
  textToDisplay: string;
};

const OrderNotAllowedScreen = ({
  textToDisplay,
}: OrderNotAllowedScreenPropsType) => {
  return (
    <View style={styles.container}>
      <FontAwesome6
        name="face-grin-beam-sweat"
        size={100}
        color={colors.error}
        style={styles.icon}
      />
      <Text style={styles.text}>{textToDisplay}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 32,
  },
  text: {
    fontSize: 32,
    textAlign: "center",
    color: colors.error,
    fontWeight: 500,
  },
});

export default OrderNotAllowedScreen;
