import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

const EmptyCart = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="cart" size={200} color="lightgray" />
      <Text style={styles.message}>There are no items in your cart</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 24,
    color: "gray",
  },
});

export default EmptyCart;
