import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { PAYMENT_POLL_INTERVAL_MS, PAYMENT_POLL_TIMEOUT_MS } from "../../constants/config";
import { CartItemType } from "../../constants/types";
import { useOrderContext } from "../../contexts/OrderContext";
import styles from "../../styles/components/Confirmation";
import orderConfirmationItemStyleSheet from "../../styles/components/OrderConfirmationItem";
import { formatCurrency } from "../../utils/formatCurrency";
import AddressSummary from "../AddressSummary";
import EmptyOrder from "../EmptyOrder";
import CustomerSummary from "../CustomerSummary";
import OrderSummary from "../OrderSummary";
import PaymentSummary from "../PaymentSummary";
import CustomImage from "../common/CustomImage";
import LoadingScreen from "../common/LoadingScreen";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Confirmation = () => {
  const { orderData, reloadOrder } = useOrderContext();
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const isPaymentMissing = orderData?.payment === null;
  // Each reload renders again, so the latest function is read from a ref instead of
  // restarting the wait
  const reloadOrderRef = useRef(reloadOrder);
  useEffect(() => {
    reloadOrderRef.current = reloadOrder;
  });

  // The Stripe webhook adds the payment, so the order is checked again with a pause between
  // checks and for a limited time. A failed check waits like any other
  useEffect(() => {
    if (!isPaymentMissing || !isWaiting) return;
    let isCancelled = false;
    const waitForPayment = async () => {
      const deadline = Date.now() + PAYMENT_POLL_TIMEOUT_MS;
      while (Date.now() < deadline) {
        await delay(PAYMENT_POLL_INTERVAL_MS);
        if (isCancelled) return;
        await reloadOrderRef.current().catch(() => undefined);
        if (isCancelled) return;
      }
      setIsWaiting(false);
    };
    waitForPayment();
    return () => {
      isCancelled = true;
    };
  }, [isPaymentMissing, isWaiting]);

  // OrderStore shows the first load, so here the order failed to load. Retrying is up to
  // the user, so a failing API gets one request per tap
  if (!orderData) {
    return <EmptyOrder onRetry={reloadOrder} />;
  }

  if (isPaymentMissing && !isWaiting) {
    return (
      <EmptyOrder
        message="We are still confirming your payment, try again in a moment"
        onRetry={() => setIsWaiting(true)}
      />
    );
  }

  if (orderData.payment === null) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      testID="Confirmation.Container"
    >
      {orderData.details.map((item) => {
        return <OrderConfirmationItem data={item} key={item.id} />;
      })}
      <PaymentSummary data={orderData.payment.paymentDetails} />
      <OrderSummary data={orderData.totals} />
      <CustomerSummary data={orderData.customer} />
      <AddressSummary data={orderData.address} />
    </ScrollView>
  );
};

export default Confirmation;

export type OrderConfirmationItemPropsType = {
  data: CartItemType;
};

export const OrderConfirmationItem = ({
  data,
}: OrderConfirmationItemPropsType) => {
  const styles = orderConfirmationItemStyleSheet;
  const { theme } = useUnistyles();
  return (
    <View
      style={styles.container}
      testID={`OrderConfirmationItem.Container-${data.id}`}
    >
      <CustomImage
        imageUrl={data.product.image}
        width={45}
        height={45}
        testID={`OrderConfirmationItem.Image-${data.id}`}
      />
      <FontAwesome name="times" size={24} color={theme.colors.typography} />
      <Text
        style={styles.text}
        testID={`OrderConfirmationItem.Quantity-${data.id}`}
      >
        {data.quantity}
      </Text>
      <Text
        style={styles.text}
        testID={`OrderConfirmationItem.UnitPrice-${data.id}`}
      >
        {formatCurrency(data.unitPrice, data.currency)}
      </Text>
      <Text
        style={styles.subtotal}
        testID={`OrderConfirmationItem.SubTotal-${data.id}`}
      >
        {formatCurrency(data.subtotal, data.currency)}
      </Text>
    </View>
  );
};
