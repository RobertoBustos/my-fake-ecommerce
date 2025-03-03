import React from "react";
import CartList from "../components/CartList";
import EmptyCart from "../components/EmptyCart";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import { useCartContext } from "../contexts/CartContext";
import { useAppNavigation } from "../hooks/useAppNavigation";

const CartScreen = () => {
  const { cart, cartSummary, createCartSummary } = useCartContext();
  const navigation = useAppNavigation();
  const isCartEmpty = cart.items.length === 0;

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

  const renderFooter = () => {
    return (
      <FooterButton
        text={isCartEmpty ? "Return to Products" : "Proceed to Payment"}
        onPress={handleRedirect}
      />
    );
  };

  if (isCartEmpty) {
    return (
      <Layout footerComponent={renderFooter()}>
        <EmptyCart />
      </Layout>
    );
  }

  return (
    <Layout footerComponent={renderFooter()}>
      <CartList cartItems={cart.items} />
    </Layout>
  );
};

export default CartScreen;
