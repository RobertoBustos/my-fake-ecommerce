import { useIsFocused } from "expo-router";
import { useEffect } from "react";
import useOrder from "../hooks/useOrder";
import { setCartFromOrder } from "../redux/cart/reducer";
import { selectCartId } from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedOrderId } from "../redux/order/reducer";
import IncompleteOrderCard from "./IncompleteOrderCard";

const IncompleteOrdersList = () => {
  const dispatch = useAppDispatch();
  const cartId = useAppSelector(selectCartId);
  const { fetchIncompleteOrders, incompleteOrders } = useOrder();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (cartId !== "" && isFocused) {
      fetchIncompleteOrders(cartId);
    }
    return () => {};
  }, [cartId, fetchIncompleteOrders, isFocused]);

  useEffect(() => {
    if (incompleteOrders.length === 1 && isFocused) {
      dispatch(setSelectedOrderId(incompleteOrders[0].id));
      dispatch(setCartFromOrder(incompleteOrders[0].details));
    }
    return () => {};
  }, [dispatch, incompleteOrders, isFocused]);

  if (incompleteOrders.length === 1) {
    return <IncompleteOrderCard data={incompleteOrders[0]} />;
  }

  return null;
};

export default IncompleteOrdersList;
