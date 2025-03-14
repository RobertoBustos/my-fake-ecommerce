import { useAppSelector } from "@/app/redux/hooks";
import { selectIsOrderRefreshing } from "@/app/redux/order/selectors";
import { useMemo } from "react";
import {
  Alert,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useOrderContext } from "../../contexts/OrderContext";
import useKeyboardStatus from "../../hooks/useKeyboardStatus";
import CheckoutButtons from "../CheckoutButtons";
import OrderSummary from "../OrderSummary";
import AddressDetailsForm from "../forms/AddressDetailsForm";
import UserDetailsForm from "../forms/UserDetailsForm";
import CheckoutFooter from "./CheckoutFooter";
import CheckoutHeader from "./CheckoutHeader";

const Checkout = () => {
  const { keyboardStatus } = useKeyboardStatus();
  const {
    orderData,
    setOrderForEdition,
    cancelIncompleteOrder,
    refreshCheckout,
  } = useOrderContext();
  const isRefresing = useAppSelector(selectIsOrderRefreshing);

  const userData = useMemo(() => {
    return {
      email: orderData?.customerData?.email || "",
      userName: orderData?.customerData?.userName || "",
    };
  }, [orderData]);

  const addressData = useMemo(() => {
    return {
      address: orderData?.shippingData?.address || "",
      zipCode: orderData?.shippingData?.zipCode || "",
    };
  }, [orderData]);

  const handleReturnOrderToCart = () => {
    Alert.alert("Do you wish to modify this order?", "", [
      {
        text: "OK",
        onPress: () => setOrderForEdition(),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  const handleCancelOrder = () => {
    Alert.alert("Cancel this order?", "", [
      {
        text: "OK",
        onPress: () => cancelIncompleteOrder(),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  if (!orderData) {
    return null;
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefresing} onRefresh={refreshCheckout} />
      }
    >
      <>
        <CheckoutHeader orderId={orderData.orderId} />
        <OrderSummary data={orderData.summary} />
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
    </KeyboardAwareScrollView>
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
