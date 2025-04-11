import { useOrderContext } from "@/app/contexts/OrderContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { CartItemType } from "../../constants/types";
import { formatCurrency } from "../../utils/formatCurrency";
import AddressSummary from "../AddressSummary";
import CustomerSummary from "../CustomerSummary";
import OrderSummary from "../OrderSummary";
import PaymentSummary from "../PaymentSummary";
import CustomImage from "../common/CustomImage";
import LoadingScreen from "../common/LoadingScreen";

const Confirmation = () => {
  const { orderData, reloadOrder } = useOrderContext();

  if (!orderData || orderData.payment === null) {
    reloadOrder();
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

const styles = StyleSheet.create({
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
    <View
      style={styles2.container}
      testID={`OrderConfirmationItem.Container-${data.id}`}
    >
      <CustomImage
        imageUrl={data.product.image}
        width={45}
        height={45}
        testID={`OrderConfirmationItem.Image-${data.id}`}
      />
      <FontAwesome name="times" size={24} color="black" />
      <Text
        style={styles2.text}
        testID={`OrderConfirmationItem.Quantity-${data.id}`}
      >
        {data.quantity}
      </Text>
      <Text
        style={styles2.text}
        testID={`OrderConfirmationItem._UnitPrice-${data.id}`}
      >
        {formatCurrency(data.unitPrice)}
      </Text>
      <Text
        style={styles2.subtotal}
        testID={`OrderConfirmationItem.SubTotal-${data.id}`}
      >
        {formatCurrency(data.subtotal)}
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
