import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import orderNotAllowedScreenStyleSheet from "../styles/components/OrderNotAllowedScreen";

export type OrderNotAllowedScreenPropsType = {
  textToDisplay: string;
};

const OrderNotAllowedScreen = ({
  textToDisplay,
}: OrderNotAllowedScreenPropsType) => {
  const dispatch = useAppDispatch();
  const { styles, theme } = useStyles(orderNotAllowedScreenStyleSheet);

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
