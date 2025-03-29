import Layout from "../components/Layout";
import Cart from "../components/cart/Cart";
import CartFooter from "../components/cart/CartFooter";

const CartScreen = () => {
  return (
    <Layout footerComponent={<CartFooter />}>
      <Cart />
    </Layout>
  );
};

export default CartScreen;
