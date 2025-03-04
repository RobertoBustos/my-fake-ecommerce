import React from "react";
import Layout from "../components/Layout";
import Checkout from "../components/checkout/Checkout";
import CheckoutFooter from "../components/checkout/CheckoutFooter";

const CheckoutScreen = () => {
  return (
    <Layout footerComponent={<CheckoutFooter />}>
      <Checkout />
    </Layout>
  );
};

export default CheckoutScreen;
