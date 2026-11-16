import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import styles from "../../styles/components/ConfirmationHeader";

export type ConfirmationHeaderPropsType = {
  orderId: string;
};

const ConfirmationHeader = ({ orderId }: ConfirmationHeaderPropsType) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container} testID="ConfirmationHeader.Container">
      <Text
        style={styles.text}
        testID="ConfirmationHeader.OrderIdText"
      >{`Order Number ${orderId}`}</Text>
      <FontAwesome
        name="shopping-bag"
        size={theme.headerIconSize}
        color={theme.colors.primary}
      />
      <Text style={styles.text} testID="ConfirmationHeader.Text">
        {"Thanks for your purchase, here's your order confirmation details"}
      </Text>
    </View>
  );
};

export default ConfirmationHeader;
