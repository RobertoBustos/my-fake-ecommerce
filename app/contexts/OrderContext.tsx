import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import OrderNotAllowedScreen from "../components/OrderNotAllowedScreen";
import LoadingScreen from "../components/common/LoadingScreen";
import { OrderType, PaymentMethodType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import { resetCart, setCartFromOrder } from "../redux/cart/reducer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  cancelOrder,
  changeOrdertoIncomplete,
  fetchOrder,
  fetchOrderPayment,
  setSelectedOrderId,
  updateCustomerData,
} from "../redux/order/reducer";
import {
  selectIsOrderLoading,
  selectIsPaymentLoading,
  selectIsUpdating,
  selectSelectedOrderId,
} from "../redux/order/selectors";

export type OrderContextType = {
  orderId: string | undefined;
  orderData: OrderType | undefined;
  paymentData: PaymentMethodType | undefined;
  isLoading: boolean;
  isLoadingPayment: boolean;
  isUpdating: boolean;
  updateOrderCustomer: () => void;
  setOrderForEdition: () => void;
  cancelIncompleteOrder: () => void;
  leaveCheckout: () => void;
};

const OrderContext = createContext<OrderContextType>({
  orderId: undefined,
  orderData: undefined,
  paymentData: undefined,
  isLoading: false,
  isLoadingPayment: false,
  isUpdating: false,
  updateOrderCustomer: () => {},
  setOrderForEdition: () => {},
  cancelIncompleteOrder: () => {},
  leaveCheckout: () => {},
});

const OrderStore = ({ children }: PropsWithChildren) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsOrderLoading);
  const isLoadingPayment = useAppSelector(selectIsPaymentLoading);
  const isUpdating = useAppSelector(selectIsUpdating);
  const orderId = useAppSelector(selectSelectedOrderId);
  const [orderData, setOrderData] = useState<OrderType>();
  const [paymentData, setPaymentData] = useState<PaymentMethodType>();

  const fetchOrderData = useCallback(async (orderId: string) => {
    if (isLoading) return;
    dispatch(resetCart());
    dispatch(fetchOrder(orderId))
      .unwrap()
      .then((response) => {
        setOrderData(response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPaymentData = useCallback(async () => {
    if (!orderData || orderData.paymentIntent === null || isLoadingPayment)
      return;
    dispatch(
      fetchOrderPayment({
        orderId: orderData.orderId,
        paymentId: orderData.paymentIntent.paymentId,
      })
    )
      .unwrap()
      .then((response) => {
        setPaymentData(response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData]);

  const updateOrderCustomer = () => {
    if (!orderId) return;
    dispatch(updateCustomerData(orderId))
      .unwrap()
      .then((response) => {
        fetchOrderData(response.orderId);
      });
  };

  const setOrderForEdition = () => {
    if (!orderData) return;
    dispatch(changeOrdertoIncomplete(orderData.orderId))
      .unwrap()
      .then(() => {
        fetchOrderData(orderData.orderId).then(() => {
          if (orderData.items !== null) {
            dispatch(setCartFromOrder(orderData.items));
            return navigation.navigate("Products");
          }
        });
      });
  };

  const cancelIncompleteOrder = () => {
    if (!orderData) return;
    return dispatch(cancelOrder(orderData.orderId))
      .unwrap()
      .then(() => {
        dispatch(setSelectedOrderId(undefined));
        return navigation.navigate("Products");
      });
  };

  const leaveCheckout = () => {
    dispatch(setSelectedOrderId(undefined));
    navigation.goBack();
  };

  useEffect(() => {
    fetchPaymentData();
    return () => {};
  }, [fetchPaymentData, orderData]);

  useEffect(() => {
    if (orderId) {
      fetchOrderData(orderId);
    }
    return () => {};
  }, [fetchOrderData, orderId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (orderData?.status === "cancelled") {
    return (
      <OrderNotAllowedScreen textToDisplay="Sorry, This order has been cancelled" />
    );
  }

  if (orderData?.status === "complete") {
    return (
      <OrderNotAllowedScreen textToDisplay="Sorry, This order has been completed" />
    );
  }

  return (
    <OrderContext.Provider
      value={{
        orderId,
        orderData,
        paymentData,
        isLoading,
        isLoadingPayment,
        isUpdating,
        updateOrderCustomer,
        setOrderForEdition,
        cancelIncompleteOrder,
        leaveCheckout,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  return useContext(OrderContext);
};

export default OrderStore;
