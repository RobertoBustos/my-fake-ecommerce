import { useOrder } from "@/app/hooks/useOrder";
import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useKeyboardStatus } from "../../hooks/useKeyboardStatus";
import OrderSummary from "../OrderSummary";
import AddressDetailsForm from "../forms/AddressDetailsForm";
import UserDetailsForm from "../forms/UserDetailsForm";
import CheckoutFooter from "./CheckoutFooter";
import CheckoutHeader from "./CheckoutHeader";

export type CheckoutPropsType = {
  orderId: number;
};

const Checkout = ({ orderId }: CheckoutPropsType) => {
  const { keyboardStatus } = useKeyboardStatus();
  const { orderData, isLoading } = useOrder(orderId);

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

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {!orderData ? null : (
        <>
          <CheckoutHeader orderId={orderId.toString()} />
          <OrderSummary data={orderData.summary} isLoading={isLoading} />
          <UserDetailsForm data={userData} isLoading={isLoading} />
          <AddressDetailsForm data={addressData} isLoading={isLoading} />
        </>
      )}
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
