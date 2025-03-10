import React from "react";
import Layout from "../components/Layout";
import Checkout from "../components/checkout/Checkout";
import CheckoutFooter from "../components/checkout/CheckoutFooter";

const CheckoutScreen = ({ route }: any) => {
  return (
    <Layout footerComponent={<CheckoutFooter />}>
      <Checkout orderId={route.params.orderId} />
    </Layout>
  );
};

export default CheckoutScreen;
