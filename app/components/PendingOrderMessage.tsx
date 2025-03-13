import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import {
  selectIncompleteOrders,
  selectSelectedOrderId,
} from "../redux/order/selectors";
import CustomCard from "./common/CustomCard";

const PendingOrderMessage = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const incompleteOrders = useAppSelector(selectIncompleteOrders);
  const currentOrderId = useAppSelector(selectSelectedOrderId);

  const handleRedirect = (orderId: string) => {
    if (currentOrderId !== orderId) {
      dispatch(setSelectedOrderId(orderId));
    }
    navigation.navigate("Confirmation");
  };

  return incompleteOrders.map((order, index) => {
    return (
      <CustomCard
        variant="warning"
        key={index}
        onPress={() => handleRedirect(order.orderId)}
      >
        <View style={{ width: "100%", height: 30 }}>
          <Text
            style={styles.text}
          >{`Complete order number ${order.orderId} for $${order.summary?.total}`}</Text>
        </View>
      </CustomCard>
    );
  });
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 8,
    color: colors.primary,
    fontWeight: 500,
  },
});

export default PendingOrderMessage;
