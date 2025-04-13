import { useMemo } from "react";
import { RefreshControl } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useOrderContext } from "../../contexts/OrderContext";
import AddressSummary from "../AddressSummary";
import CheckoutButtons from "../CheckoutButtons";
import EmptyOrder from "../EmptyOrder";
import OrderNotAllowedScreen from "../OrderNotAllowedScreen";
import OrderSummary from "../OrderSummary";
import UserDetailsForm from "../forms/UserDetailsForm";
import CheckoutHeader from "./CheckoutHeader";

const Checkout = () => {
  const { orderData, reloadOrder, isLoading, cancelOrder, returnOrderToCart } =
    useOrderContext();

  const userData = useMemo(() => {
    return {
      email: orderData?.customer?.email || "",
      name: orderData?.customer?.name || "",
    };
  }, [orderData]);

  const handleReturnOrderToCart = () => {
    returnOrderToCart();
  };

  const handleCancelOrder = () => {
    cancelOrder();
  };

  if (!orderData) {
    return <EmptyOrder onRetry={reloadOrder} />;
  }

  if (orderData && orderData.status === "COMPLETE") {
    return (
      <OrderNotAllowedScreen textToDisplay="Sorry, This order has been completed" />
    );
  }

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={reloadOrder} />
      }
      bottomOffset={100}
      showsVerticalScrollIndicator={false}
      testID="Checkout.Container"
    >
      <CheckoutHeader orderId={orderData.id} />
      <OrderSummary data={orderData.totals} />
      <UserDetailsForm data={userData} />
      <AddressSummary data={orderData.address} />
      <CheckoutButtons
        editOrderLabel="Edit Order"
        cancelOrderLabel="Cancel Order"
        onCancelOrder={handleCancelOrder}
        onEditOrder={handleReturnOrderToCart}
      />
    </KeyboardAwareScrollView>
  );
};

export default Checkout;
