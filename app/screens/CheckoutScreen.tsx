import Layout from "../components/Layout";
import Checkout from "../components/checkout/Checkout";
import CheckoutFooter from "../components/checkout/CheckoutFooter";
import OrderStore from "../contexts/OrderContext";

const CheckoutScreen = () => {
  return (
    <OrderStore>
      <Layout footerComponent={<CheckoutFooter />}>
        <Checkout />
      </Layout>
    </OrderStore>
  );
};

export default CheckoutScreen;
