import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddressDetails from "../components/AddressDetails";
import CheckoutHeader from "../components/CheckoutHeader";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import OrderDetails from "../components/OrderDetails";
import UserDetails from "../components/UserDetails";
import { useCheckoutContext } from "../contexts/CheckoutContext";
import { useStripeContext } from "../contexts/StripeContext";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useKeyboardStatus } from "../hooks/useKeyboardStatus";
import { useOrder } from "../hooks/useOrder";
import { formatCurrency } from "../utils/formatCurrency";

const CheckoutScreen = () => {
  const { keyboardStatus } = useKeyboardStatus();
  const {
    isLoading,
    isPaymentSheetReady,
    initializePaymentSheet,
    confirmPayment,
  } = useStripeContext();
  const { isValidUser } = useCheckoutContext();
  const { createOrder } = useOrder();
  const navigation = useAppNavigation();

  const renderFooter = () => {
    if (isPaymentSheetReady) {
      const handleConfirmPayment = () => {
        confirmPayment().then(() => {
          navigation.navigate("Confirmation");
        });
      };
      return (
        <FooterButton
          text={`Complete Payment Info`}
          disabled={isLoading}
          onPress={handleConfirmPayment}
          isLoading={isLoading}
        />
      );
    }

    const order = createOrder();
    const handlePaymentIntentCreation = () => {
      initializePaymentSheet(order);
    };
    return order ? (
      <FooterButton
        text={`Prepare Payment for  ${formatCurrency({
          amount: order.payment!.amount,
          currency: "MXN",
        })}`}
        disabled={!isPaymentSheetReady && !isValidUser}
        onPress={handlePaymentIntentCreation}
        isLoading={isLoading}
      />
    ) : null;
  };

  return (
    <Layout footerComponent={renderFooter()}>
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <CheckoutHeader />
        <OrderDetails />
        <UserDetails />
        <AddressDetails />
        {keyboardStatus === "shown" && Platform.OS === "ios" ? (
          <View style={styles.footer}>{renderFooter()}</View>
        ) : null}
      </KeyboardAwareScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    width: "100%",
    height: 70,
    paddingVertical: 8,
  },
});

export default CheckoutScreen;
