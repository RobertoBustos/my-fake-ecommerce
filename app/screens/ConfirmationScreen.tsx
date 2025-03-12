import Layout from "../components/Layout";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import OrderStore from "../contexts/OrderContext";

const ConfirmationScreen = () => {
  return (
    <OrderStore>
      <Layout footerComponent={<ConfirmationFooter />}>
        <Confirmation />
      </Layout>
    </OrderStore>
  );
};

export default ConfirmationScreen;
