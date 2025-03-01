import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import CartList from "../components/CartList";
import EmptyCart from "../components/EmptyCart";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import { RootStackParamList } from "../constants/types";
import { useCartContext } from "../contexts/cartContext";

const CartScreen = () => {
  const { cart } = useCartContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isCartEmpty = cart.items.length === 0;

  const handleRedirect = () => {
    if (isCartEmpty) {
      navigation.goBack();
      return;
    }
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
