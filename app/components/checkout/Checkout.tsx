import { useMemo } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useOrderContext } from "../../contexts/OrderContext";
import useKeyboardStatus from "../../hooks/useKeyboardStatus";
import CheckoutButtons from "../CheckoutButtons";
import OrderNotAllowedScreen from "../OrderNotAllowedScreen";
import OrderSummary from "../OrderSummary";
import AddressDetailsForm from "../forms/AddressDetailsForm";
import UserDetailsForm from "../forms/UserDetailsForm";
import CheckoutFooter from "./CheckoutFooter";
import CheckoutHeader from "./CheckoutHeader";

const Checkout = () => {
  const { keyboardStatus } = useKeyboardStatus();
  const { orderData, reloadOrder, isLoading, cancelOrder, returnOrderToCart } =
    useOrderContext();

  const userData = useMemo(() => {
    return {
      email: orderData?.customer?.email || "",
      name: orderData?.customer?.name || "",
    };
  }, [orderData]);

  const addressData = useMemo(() => {
    return {
      address: orderData?.address?.address || "",
      zipCode: orderData?.address?.zipCode || "",
    };
  }, [orderData]);

  const handleReturnOrderToCart = () => {
    returnOrderToCart();
  };

  const handleCancelOrder = () => {
    cancelOrder();
  };

  if (!orderData) {
    return null;
  }

  if (orderData && orderData.status === "COMPLETE") {
    return (
      <OrderNotAllowedScreen textToDisplay="Sorry, This order has been completed" />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={reloadOrder} />
      }
    >
      <>
        <CheckoutHeader orderId={orderData.id} />
        <OrderSummary data={orderData.totals} />
        <UserDetailsForm data={userData} />
        <AddressDetailsForm data={addressData} />
        <CheckoutButtons
          editOrderLabel="Edit Order"
          cancelOrderLabel="Cancel Order"
          onCancelOrder={handleCancelOrder}
          onEditOrder={handleReturnOrderToCart}
        />
      </>
      {keyboardStatus === "shown" && Platform.OS === "ios" ? (
        <View style={styles.footer}>{<CheckoutFooter />}</View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  footer: {
    width: "100%",
    height: 70,
    paddingVertical: 8,
  },
});

export default Checkout;
