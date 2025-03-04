import { useKeyboardStatus } from "@/app/hooks/useKeyboardStatus";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddressDetails from "../AddressDetails";
import OrderDetails from "../OrderDetails";
import UserDetails from "../UserDetails";
import CheckoutFooter from "./CheckoutFooter";
import CheckoutHeader from "./CheckoutHeader";

const Checkout = () => {
  const { keyboardStatus } = useKeyboardStatus();

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <CheckoutHeader />
      <OrderDetails />
      <UserDetails />
      <AddressDetails />
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
