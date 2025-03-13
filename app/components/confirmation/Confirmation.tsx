import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { CartItemType } from "../../constants/types";
import { useOrderContext } from "../../contexts/OrderContext";
import { formatCurrency } from "../../utils/formatCurrency";
import AddressSummary from "../AddressSummary";
import CustomerSummary from "../CustomerSummary";
import OrderSummary from "../OrderSummary";
import PaymentSummary from "../PaymentSummary";
import CustomImage from "../common/CustomImage";
import ConfirmationHeader from "./ConfirmationHeader";

const Confirmation = () => {
  const { orderData, paymentData, isLoadingPayment } = useOrderContext();

  if (!orderData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <>
          <ConfirmationHeader orderId={orderData.orderId} />
          {orderData.items?.map((item) => {
            return <OrderConfirmationItem data={item} key={item.id} />;
          })}
          {paymentData ? (
            <PaymentSummary data={paymentData} isLoading={isLoadingPayment} />
          ) : null}
          <OrderSummary data={orderData.summary} />
          <CustomerSummary data={orderData.customerData} />
          <AddressSummary data={orderData.shippingData} />
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Confirmation;

export type OrderConfirmationItemPropsType = {
  data: CartItemType;
};

export const OrderConfirmationItem = ({
  data,
}: OrderConfirmationItemPropsType) => {
  return (
    <View style={styles2.container}>
      <CustomImage imageUrl={data.image} width={45} height={45} />
      <FontAwesome name="times" size={24} color="black" />
      <Text style={styles2.text}>{data.quantity}</Text>
      <Text style={styles2.text}>
        {formatCurrency({ amount: data.price.amount, currency: "MXN" })}
      </Text>
      <Text style={styles2.subtotal}>
        {formatCurrency({ amount: data.subtotal, currency: "MXN" })}
      </Text>
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
  subtotal: {
    color: colors.primary,
    fontWeight: 600,
    fontSize: 16,
  },
});
