import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";
import useAppNavigation from "../hooks/useAppNavigation";
import useOrder from "../hooks/useOrder";
import { selectCartId } from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import { selectSelectedOrderId } from "../redux/order/selectors";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";

export type IncompleteOrder = {
  id: string;
  status: string;
  totals: {
    total: number;
  };
};

const IncompleteOrdersList = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const currentOrderId = useAppSelector(selectSelectedOrderId);
  const cartId = useAppSelector(selectCartId);
  const { fetchIncompleteOrders, incompleteOrders } = useOrder();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (cartId !== "" && isFocused) {
      fetchIncompleteOrders(cartId);
    }
    return () => {};
  }, [cartId, fetchIncompleteOrders, isFocused]);

  const handleRedirect = (orderId: string) => {
    if (currentOrderId !== orderId) {
      dispatch(setSelectedOrderId(orderId));
    }
    navigation.navigate("Checkout", { orderId });
  };

  if (!incompleteOrders) {
    return null;
  }

  const invalidIncompleteStatus = ["cancelled", "complete"];
  return incompleteOrders.map((order: IncompleteOrder, index: number) => {
    return invalidIncompleteStatus.includes(order.status) ? null : (
      <CustomCard
        variant="warning"
        key={index}
        onPress={() => handleRedirect(order.id)}
      >
        <Text style={styles.text}>{`Complete order number ${
          order.id
        } for $${formatCurrency(order.totals.total)}`}</Text>
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
