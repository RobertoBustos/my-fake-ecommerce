import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ScrollView, Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import { CartItemType } from "../../constants/types";
import { useOrderContext } from "../../contexts/OrderContext";
import confirmationStyleSheet from "../../styles/components/Confirmation";
import orderConfirmationItemStyleSheet from "../../styles/components/OrderConfirmationItem";
import { formatCurrency } from "../../utils/formatCurrency";
import AddressSummary from "../AddressSummary";
import CustomerSummary from "../CustomerSummary";
import OrderSummary from "../OrderSummary";
import PaymentSummary from "../PaymentSummary";
import CustomImage from "../common/CustomImage";
import LoadingScreen from "../common/LoadingScreen";

const Confirmation = () => {
  const { orderData, reloadOrder } = useOrderContext();
  const { styles } = useStyles(confirmationStyleSheet);

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

export default Confirmation;

export type OrderConfirmationItemPropsType = {
  data: CartItemType;
};

export const OrderConfirmationItem = ({
  data,
}: OrderConfirmationItemPropsType) => {
  const { styles, theme } = useStyles(orderConfirmationItemStyleSheet);
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
        testID={`OrderConfirmationItem._UnitPrice-${data.id}`}
      >
        {formatCurrency(data.unitPrice)}
      </Text>
      <Text
        style={styles.subtotal}
        testID={`OrderConfirmationItem.SubTotal-${data.id}`}
      >
        {formatCurrency(data.subtotal)}
      </Text>
    </View>
  );
};
