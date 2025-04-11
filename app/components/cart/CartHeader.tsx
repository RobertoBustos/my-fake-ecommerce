import { useCartContext } from "@/app/contexts/CartContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

const CartHeader = () => {
  const { isCartEmpty } = useCartContext();

  if (isCartEmpty) {
    return null;
  }

  return (
    <View style={styles.container} testID="CartHeader.Container">
      <FontAwesome5 name="file-invoice" size={150} color={colors.primary} />
      <Text style={styles.text} testID="CartHeader.Text">
        These are the items in your shopping cart
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

export default CartHeader;
