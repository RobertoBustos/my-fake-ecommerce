import { StaticScreenProps } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import Layout from "../components/Layout";
import Checkout from "../components/checkout/Checkout";
import CheckoutFooter from "../components/checkout/CheckoutFooter";
import CheckoutHeader from "../components/checkout/CheckoutHeader";
import { RootStackParamList } from "../constants/types";
import OrderStore from "../contexts/OrderContext";

export type CheckoutScreenPropsType = StaticScreenProps<
  RootStackParamList["Checkout"]
>;

const CheckoutScreen = ({ route }: CheckoutScreenPropsType) => {
  return (
    <OrderStore orderId={route.params.orderId}>
      <Layout
        headerComponent={<CheckoutHeader orderId={route.params.orderId} />}
        footerComponent={<CheckoutFooter />}
        testID="CheckoutScreen.Layout"
      >
        <View style={styles.container}>
          <Checkout />
        </View>
      </Layout>
    </OrderStore>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default CheckoutScreen;
