import { StaticScreenProps } from "expo-router/react-navigation";
import Layout from "../components/Layout";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import ConfirmationHeader from "../components/confirmation/ConfirmationHeader";
import { RootStackParamList } from "../constants/types";
import OrderStore from "../contexts/OrderContext";

export type ConfirmationScreenPropsType = StaticScreenProps<
  RootStackParamList["Confirmation"]
>;

const ConfirmationScreen = ({ route }: ConfirmationScreenPropsType) => {
  return (
    <OrderStore orderId={route.params.orderId}>
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
