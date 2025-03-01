import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CartItem from "../components/CartItem";
import EmptyCart from "../components/EmptyCart";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import { useCartContext } from "../contexts/cartContext";

const CartScreen = ({ navigation }: any) => {
  const { cart } = useCartContext();
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
      <View style={styles.container}>
        <FlatList
          data={cart.items}
          renderItem={({ item }) => <CartItem data={item} />}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default CartScreen;
