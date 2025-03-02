import { FlatList, StyleSheet, View } from "react-native";
import { CartItemType } from "../constants/types";
import CartItemCard from "./CartItemCard";

export type CartListPropsType = {
  cartItems: CartItemType[];
};

const CartList = ({ cartItems }: CartListPropsType) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => <CartItemCard data={item} />}
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
