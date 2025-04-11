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
        <Cart />
      </Layout>
    </CartStore>
  );
};

export default CartScreen;
