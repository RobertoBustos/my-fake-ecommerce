import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export type CheckoutHeaderPropsType = {
  orderId: string;
};

const CheckoutHeader = ({ orderId }: CheckoutHeaderPropsType) => {
  return (
    <View style={styles.container} testID="CheckoutHeader.Container">
      <Text
        style={styles.text}
        testID="CheckoutHeader.OrderIdText"
      >{`Order Number ${orderId}`}</Text>
      <FontAwesome5
        name="file-invoice-dollar"
        size={150}
        color={colors.primary}
      />
      <Text style={styles.text} testID="CheckoutHeader.Text">
        Please fill your payment information to complete your order
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 8,
  },
});

export default CheckoutHeader;
