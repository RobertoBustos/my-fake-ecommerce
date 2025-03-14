import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";
import useAppNavigation from "../hooks/useAppNavigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import {
  selectIncompleteOrders,
  selectSelectedOrderId,
} from "../redux/order/selectors";
import CustomCard from "./common/CustomCard";

const IncompleteOrdersList = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const incompleteOrders = useAppSelector(selectIncompleteOrders);
  const currentOrderId = useAppSelector(selectSelectedOrderId);

  const handleRedirect = (orderId: string) => {
    if (currentOrderId !== orderId) {
      dispatch(setSelectedOrderId(orderId));
    }
    navigation.navigate("Checkout");
  };

  const invalidIncompleteStatus = ["cancelled", "complete"];

  return incompleteOrders.map((order, index) => {
    return invalidIncompleteStatus.includes(order.status) ? null : (
      <CustomCard
        variant="warning"
        key={index}
        onPress={() => handleRedirect(order.orderId)}
      >
        <Text
          style={styles.text}
        >{`Complete order number ${order.orderId} for $${order.summary?.total}`}</Text>
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

export default IncompleteOrdersList;
