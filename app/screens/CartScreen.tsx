import Layout from "../components/Layout";
import Cart from "../components/cart/Cart";
import CartFooter from "../components/cart/CartFooter";
import CartStore from "../contexts/CartContext";

const CartScreen = () => {
  return (
    <CartStore>
      <Layout footerComponent={<CartFooter />}>
        <Cart />
      </Layout>
    </CartStore>
  );
};

export default CartScreen;
