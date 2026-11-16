import { StaticScreenProps } from "expo-router/react-navigation";
import React from "react";
import Layout from "../components/Layout";
import Address from "../components/address/Address";
import AddressFooter from "../components/address/AddressFooter";
import AddressHeader from "../components/address/AddressHeader";
import { RootStackParamList } from "../constants/types";
import OrderStore from "../contexts/OrderContext";

type AddressScreenPropsType = StaticScreenProps<RootStackParamList["Address"]>;

const AddressScreen = ({ route }: AddressScreenPropsType) => {
  return (
    <OrderStore
      orderId={route.params.orderId}
      forceGoBack={route.params.goBack}
    >
      <Layout
        headerComponent={<AddressHeader />}
        footerComponent={<AddressFooter />}
        testID="AddressScreen.Layout"
      >
        <Address />
      </Layout>
    </OrderStore>
  );
};

export default AddressScreen;
