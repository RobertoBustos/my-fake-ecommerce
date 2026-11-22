import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Layout from "../components/Layout";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import ConfirmationHeader from "../components/confirmation/ConfirmationHeader";
import { RootStackParamList } from "../constants/types";
import OrderStore from "../contexts/OrderContext";

export type ConfirmationScreenPropsType = NativeStackScreenProps<RootStackParamList, "Confirmation">;

const ConfirmationScreen = ({ route }: ConfirmationScreenPropsType) => {
  return (
    // A cancelled order is shown here as cancelled, the other screens don't open it
    <OrderStore
      orderId={route.params.orderId}
      showCancelled
      isPaymentExpected={route.params.afterPayment === true}
    >
      <Layout
        headerComponent={<ConfirmationHeader orderId={route.params.orderId} />}
        footerComponent={<ConfirmationFooter />}
        testID="ConfirmationScreen.Layout"
      >
        <Confirmation />
      </Layout>
    </OrderStore>
  );
};

export default ConfirmationScreen;
