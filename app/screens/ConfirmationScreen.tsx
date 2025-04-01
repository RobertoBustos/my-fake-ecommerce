import { StaticScreenProps } from "@react-navigation/native";
import Layout from "../components/Layout";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import { RootStackParamList } from "../constants/types";
import OrderStore from "../contexts/OrderContext";

export type ConfirmationScreenPropsType = StaticScreenProps<
  RootStackParamList["Confirmation"]
>;

const ConfirmationScreen = ({ route }: ConfirmationScreenPropsType) => {
  return (
    <OrderStore orderId={route.params.orderId}>
      <Layout footerComponent={<ConfirmationFooter />}>
        <Confirmation />
      </Layout>
    </OrderStore>
  );
};

export default ConfirmationScreen;
