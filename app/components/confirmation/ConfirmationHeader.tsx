import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useOrderContext } from "../../contexts/OrderContext";
import useAppNavigation from "../../hooks/useAppNavigation";
import styles from "../../styles/components/ConfirmationHeader";
import { getConfirmationCopy } from "./confirmationCopy";

export type ConfirmationHeaderPropsType = {
  orderId: string;
};

const ConfirmationHeader = ({ orderId }: ConfirmationHeaderPropsType) => {
  const { theme } = useUnistyles();
  const navigation = useAppNavigation();
  const { orderData, isPaymentExpected } = useOrderContext();
  const { title, message, icon } = getConfirmationCopy(orderData?.status, isPaymentExpected);

  // The navigator doesn't know the order, so the screen's title is set from here
  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  return (
    <View style={styles.container} testID="ConfirmationHeader.Container">
      <Text
        style={styles.text}
        testID="ConfirmationHeader.OrderIdText"
      >{`Order Number ${orderId}`}</Text>
      <FontAwesome5
        name={icon}
        size={theme.headerIconSize}
        color={theme.colors.primary}
      />
      <Text style={styles.text} testID="ConfirmationHeader.Text">
        {message}
      </Text>
    </View>
  );
};

export default ConfirmationHeader;
