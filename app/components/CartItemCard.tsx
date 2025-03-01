import { Alert, StyleSheet, View } from "react-native";
import { CartItemType } from "../constants/types";
import { useCartContext } from "../contexts/cartContext";
import ProductCard from "./ProductCard";
import CustomButton from "./common/CustomButton";
import { DeleteButton } from "./common/IconButtons";

export type CartItemPropsType = {
  data: CartItemType;
};

const CartItem = ({ data }: CartItemPropsType) => {
  const { onRemove } = useCartContext();

  const handleRemoveFromCart = () => {
    Alert.alert("Remove this item from cart?", "", [
      {
        text: "OK",
        onPress: () => onRemove(data.item.id),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.product}>
        <ProductCard data={data.item} quantity={data.quantity} disabled />
      </View>
      <CustomButton
        onPress={handleRemoveFromCart}
        buttonComponent={<DeleteButton color="red" size={30} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  product: {
    flex: 9,
  },
});

export default CartItem;
