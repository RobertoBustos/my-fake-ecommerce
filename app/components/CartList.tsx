import { FlatList, StyleSheet, View } from "react-native";
import { useCartContext } from "../contexts/CartContext";
import CartItemCard from "./CartItemCard";

const CartList = () => {
  const { cartItems } = useCartContext();

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => <CartItemCard data={item} disabled />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default CartList;
