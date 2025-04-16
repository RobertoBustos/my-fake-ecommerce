import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import checkoutHeaderStyleSheet from "../../styles/components/CheckoutHeader";

export type CheckoutHeaderPropsType = {
  orderId: string;
};

const CheckoutHeader = ({ orderId }: CheckoutHeaderPropsType) => {
  const { styles, theme } = useStyles(checkoutHeaderStyleSheet);
  return (
    <View style={styles.container} testID="CheckoutHeader.Container">
      <Text
        style={styles.text}
        testID="CheckoutHeader.OrderIdText"
      >{`Order Number ${orderId}`}</Text>
      <FontAwesome5
        name="file-invoice-dollar"
        size={theme.headerIconSize}
        color={theme.colors.primary}
      />
      <Text style={styles.text} testID="CheckoutHeader.Text">
        Please fill your payment information to complete your order
      </Text>
    </View>
  );
};

export default CheckoutHeader;
