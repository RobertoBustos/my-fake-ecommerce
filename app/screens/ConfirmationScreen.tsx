import { useEffect } from "react";
import Layout from "../components/Layout";
import LoadingScreen from "../components/common/LoadingScreen";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import { OrderType } from "../constants/types";
import useOrder from "../hooks/useOrder";
import { useAppSelector } from "../redux/hooks";
import { selectSelectedOrderId } from "../redux/order/selectors";

const ConfirmationScreen = () => {
  const orderId = useAppSelector(selectSelectedOrderId);
  const { fetchOrder, orders, isLoading } = useOrder();
  const orderData: OrderType | undefined =
    orders && orders.length && orders.length === 1 ? orders[0] : undefined;

  useEffect(() => {
    if (!orderId) return;
    fetchOrder(orderId, !orderData?.payment ? 1500 : 0);
    return () => {};
  }, [fetchOrder, orderData?.payment, orderId]);

  if (isLoading || !orderData?.payment) {
    return <LoadingScreen />;
  }

  return (
    <Layout footerComponent={<ConfirmationFooter />}>
      <Confirmation data={orderData} />
    </Layout>
  );
};

export default ConfirmationScreen;
