import React from "react";
import Layout from "../components/Layout";
import Cart from "../components/cart/Cart";
import CartFooter from "../components/cart/CartFooter";
import { useCartContext } from "../contexts/CartContext";
import { useAppNavigation } from "../hooks/useAppNavigation";

const CartScreen = () => {
  const { cart, cartSummary, createCartSummary } = useCartContext();
  const navigation = useAppNavigation();
  const isCartEmpty = cart.length === 0;

  const handleRedirect = () => {
    if (isCartEmpty) {
      navigation.goBack();
      return;
    }
    if (!cartSummary) {
      return;
    }
    createCartSummary();
    navigation.navigate("Checkout");
  };

  const footerText = isCartEmpty ? "Return to Products" : "Proceed to Payment";

  return (
    <Layout
      footerComponent={
        <CartFooter text={footerText} onClick={handleRedirect} />
      }
    >
      <Cart />
    </Layout>
  );
};

export default CartScreen;
