import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import styles from "../styles/components/OrderNotAllowedScreen";

export type OrderNotAllowedScreenPropsType = {
  textToDisplay: string;
};

const OrderNotAllowedScreen = ({
  textToDisplay,
}: OrderNotAllowedScreenPropsType) => {
  const dispatch = useAppDispatch();
  const { theme } = useUnistyles();

  useEffect(() => {
    return () => {
      dispatch(setSelectedOrderId(undefined));
    };
  }, [dispatch]);

  return (
    <View style={styles.container} testID="OrderNotAllowed.Container">
      <FontAwesome6
        name="face-grin-beam-sweat"
        size={100}
        color={theme.colors.disabled}
        style={styles.icon}
      />
      <Text style={styles.text} testID="OrderNotAllowed.Text">
        {textToDisplay}
      </Text>
    </View>
  );
};

export default OrderNotAllowedScreen;
