import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import confirmationHeaderStyleSheet from "../../styles/components/ConfirmationHeader";

export type ConfirmationHeaderPropsType = {
  orderId: string;
};

const ConfirmationHeader = ({ orderId }: ConfirmationHeaderPropsType) => {
  const { styles, theme } = useStyles(confirmationHeaderStyleSheet);

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
