import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

const EmptyCart = () => {
  return (
    <View style={styles.container} testID="EmptyCart.Container">
      <FontAwesome name="shopping-cart" size={200} color={colors.dark} />
      <Text style={styles.message} testID="EmptyCart.Text">
        There are no items in your cart
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 24,
    color: colors.dark,
  },
});

export default EmptyCart;
