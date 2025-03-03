import { FlatList, StyleSheet, View } from "react-native";
import { CartItemType } from "../constants/types";
import ProductCard from "./ProductCard";

export type CartListPropsType = {
  cartItems: CartItemType[];
};

const CartList = ({ cartItems }: CartListPropsType) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <ProductCard productId={item.item.id} showCartUI disabled />
        )}
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
