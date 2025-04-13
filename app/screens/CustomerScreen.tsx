import { StaticScreenProps } from "@react-navigation/native";
import React from "react";
import Layout from "../components/Layout";
import Customer from "../components/customer/Customer";
import CustomerFooter from "../components/customer/CustomerFooter";
import CustomerHeader from "../components/customer/CustomerHeader";
import { RootStackParamList } from "../constants/types";
import OrderStore from "../contexts/OrderContext";

type CustomerScreenPropsType = StaticScreenProps<
  RootStackParamList["Customer"]
>;

const CustomerScreen = ({ route }: CustomerScreenPropsType) => {
  return (
    <OrderStore orderId={route.params.orderId}>
      <Layout
        headerComponent={<CustomerHeader />}
        footerComponent={<CustomerFooter />}
        testID="CustomerScreen.Layout"
      >
        <Customer />
      </Layout>
    </OrderStore>
  );
};

export default CustomerScreen;
