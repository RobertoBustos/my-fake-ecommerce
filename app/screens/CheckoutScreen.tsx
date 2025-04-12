import { StaticScreenProps } from "@react-navigation/native";
import Layout from "../components/Layout";
import Checkout from "../components/checkout/Checkout";
import CheckoutFooter from "../components/checkout/CheckoutFooter";
import { RootStackParamList } from "../constants/types";
import OrderStore from "../contexts/OrderContext";

export type CheckoutScreenPropsType = StaticScreenProps<
  RootStackParamList["Checkout"]
>;

const CheckoutScreen = ({ route }: CheckoutScreenPropsType) => {
  return (
    <OrderStore orderId={route.params.orderId}>
      <Layout
        footerComponent={<CheckoutFooter />}
        testID="CheckoutScreen.Layout"
      >
        <Checkout />
      </Layout>
    </OrderStore>
  );
};

export default CheckoutScreen;
