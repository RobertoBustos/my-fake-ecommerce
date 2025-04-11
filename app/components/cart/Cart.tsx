import { useCartContext } from "@/app/contexts/CartContext";
import { FlatList } from "react-native";
import CartItemCard from "../CartItemCard";
import EmptyCart from "../EmptyCart";

const Cart = () => {
  const { cartItems, isCartEmpty } = useCartContext();

  if (isCartEmpty) {
    return <EmptyCart />;
  }

  return (
    <FlatList
      data={cartItems}
      renderItem={({ item }) => <CartItemCard data={item} disabled />}
      showsVerticalScrollIndicator={false}
      testID="CartList.Container"
    />
  );
};

export default Cart;
