import { StyleSheet, View } from "react-native";
import Layout from "../components/Layout";
import Cart from "../components/cart/Cart";
import CartFooter from "../components/cart/CartFooter";
import CartHeader from "../components/cart/CartHeader";
import CartStore from "../contexts/CartContext";

const CartScreen = () => {
  return (
    <CartStore>
      <Layout
        headerComponent={<CartHeader />}
        footerComponent={<CartFooter />}
        testID="CartScreen.Layout"
      >
        <View style={styles.container}>
          <Cart />
        </View>
      </Layout>
    </CartStore>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
});

export default CartScreen;
