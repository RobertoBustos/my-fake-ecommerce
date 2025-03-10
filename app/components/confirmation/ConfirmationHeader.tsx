import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export type ConfirmationHeaderPropsType = {
  orderId: string;
};

const ConfirmationHeader = ({ orderId }: ConfirmationHeaderPropsType) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Order Number ${orderId}`}</Text>
      <FontAwesome name="shopping-bag" size={150} color={colors.primary} />
      <Text style={styles.text}>
        Thanks for your purchase, here's your order confirmation details
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});

export default ConfirmationHeader;
