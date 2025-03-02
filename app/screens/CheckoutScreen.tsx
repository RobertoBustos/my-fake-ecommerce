import { Alert, Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddressDetails from "../components/AddressDetails";
import CheckoutHeader from "../components/CheckoutHeader";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import OrderDetails from "../components/OrderDetails";
import UserDetails from "../components/UserDetails";
import { useCartContext } from "../contexts/CartContext";
import { useKeyboardStatus } from "../hooks/useKeyboardStatus";
import { formatCurrency } from "../utils/formatCurrency";

const CheckoutScreen = () => {
  const { getCartSummary } = useCartContext();
  const { total } = getCartSummary();
  const { keyboardStatus } = useKeyboardStatus();

  const renderFooter = () => {
    return (
      <FooterButton
        text={`Confirm payment for ${formatCurrency({
          amount: total,
          currency: "MXN",
        })}`}
        onPress={() => Alert.alert("i will pay")}
      />
    );
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
