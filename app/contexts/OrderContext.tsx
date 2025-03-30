import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import { Alert } from "react-native";
import OrderNotAllowedScreen from "../components/OrderNotAllowedScreen";
import LoadingScreen from "../components/common/LoadingScreen";
import { OrderType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import useOrder from "../hooks/useOrder";
import { resetCart, setCartFromOrder } from "../redux/cart/reducer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setAddressData,
  setCustomerData,
  setSelectedOrderId,
} from "../redux/order/reducer";
import {
  selectAddressData,
  selectCustomerData,
  selectIsAddressDataValid,
  selectIsCustomerDataValid,
  selectSelectedOrderId,
} from "../redux/order/selectors";
import { formatCurrency } from "../utils/formatCurrency";
import { useStripeContext } from "./StripeContext";

export type OrderContextType = {
  orderData: OrderType | undefined;
  refreshCheckout: () => void;
  setOrderForEdition: () => void;
  cancelIncompleteOrder: () => void;
  isLoading: boolean;
  processCheckout: () => void;
  footerText: string;
  isProcessing: boolean;
  isDisabled: boolean;
};

const OrderContext = createContext<OrderContextType>({
  orderData: undefined,
  refreshCheckout: () => {},
  setOrderForEdition: () => {},
  cancelIncompleteOrder: () => {},
  isLoading: false,
  processCheckout: () => {},
  footerText: "",
  isProcessing: false,
  isDisabled: false,
});

const OrderStore = ({ children }: PropsWithChildren) => {
  const navigation = useAppNavigation();
  const orderId = useAppSelector(selectSelectedOrderId);
  const {
    fetchOrder,
    orders,
    updateExistingOrder,
    refetchOrder,
    createPayment,
    cancelExistingOrder,
    isLoading,
    isUpdating,
    isCreatingPayment,
    refetchIncompleteOrders,
  } = useOrder();
  const { confirmPayment, initPayment } = useStripeContext();
  const dispatch = useAppDispatch();
  const customerData = useAppSelector(selectCustomerData());
  const addressData = useAppSelector(selectAddressData());
  const isCustomerDataValid = useAppSelector(selectIsCustomerDataValid());
  const isAddressDataValid = useAppSelector(selectIsAddressDataValid());
  const orderData: OrderType | undefined =
    orders && orders.length && orders.length === 1 ? orders[0] : undefined;
  const footerText =
    orderData?.status === "PAYMENT_PENDING"
      ? `Complete Your Payment for ${formatCurrency(orderData.totals.total)}`
      : "Confirm Your Order Information";
  const isProcessing = isUpdating || isLoading || isCreatingPayment;
  const isDisabled = !isCustomerDataValid || !isAddressDataValid;

  useEffect(() => {
    if (!orderId) return;
    fetchOrder(orderId);
    return () => {};
  }, [fetchOrder, orderId]);

  useEffect(() => {
    if (orderData && orderData.customer !== null) {
      dispatch(
        setCustomerData({
          email: orderData.customer.email,
          name: orderData.customer.name,
        })
      );
    }
    if (orderData && orderData.address !== null) {
      dispatch(
        setAddressData({
          address: orderData.address.address,
          zipCode: orderData.address.zipCode,
        })
      );
    }
  }, [dispatch, orderData]);

  const refreshCheckout = () => {
    if (!orderData) return;
    refetchOrder();
  };

  const updateOrder = () => {
    if (!orderData) return;
    updateExistingOrder({
      id: orderData.id,
      customer: { email: customerData.email, name: customerData.name },
      address: { address: addressData.address, zipCode: addressData.zipCode },
      status: "PAYMENT_PENDING",
    })
      .then((data) => {
        refetchOrder();
      })
      .catch((error) => Alert.alert(error));
  };

  const setOrderForEdition = () => {
    if (!orderData) return;
    updateExistingOrder({
      id: orderData.id,
      customer: null,
      address: null,
      status: "INCOMPLETE",
    })
      .then((data) => {
        dispatch(setCartFromOrder(orderData.details));
        navigation.navigate("Products");
        return;
      })
      .catch((error) => Alert.alert(error));
  };

  const cancelIncompleteOrder = () => {
    if (!orderData) return;
    cancelExistingOrder({ id: orderData.id })
      .then(() => {
        dispatch(resetCart());
        dispatch(setSelectedOrderId(undefined));
        navigation.reset({
          index: 0,
          routes: [{ name: "Products" }],
        });
        return;
      })
      .catch((error) => Alert.alert(error));
  };

  const completeOrder = () => {
    if (!orderData) return;
    createPayment({ orderId: orderData.id })
      .then((response) => {
        initPayment(orderData, response.ephimeralKey, response.clientSecret)
          .then(() => {
            confirmPayment()
              .then((response) => {
                updateExistingOrder({
                  id: orderData.id,
                  customer: null,
                  address: null,
                  status: "COMPLETE",
                })
                  .then((response) => {
                    refetchIncompleteOrders();
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Confirmation" }],
                    });
                  })
                  .catch((error) => Alert.alert(error));
              })
              .catch((error) => Alert.alert(error));
          })
          .catch((error) => Alert.alert(error));
      })
      .catch((error) => Alert.alert(error));
  };

  const processCheckout = () => {
    if (!orderData) return;
    if (orderData.status === "PAYMENT_PENDING") {
      return completeOrder();
    }
    return updateOrder();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (orderData?.status === "CANCELLED") {
    return (
      <OrderNotAllowedScreen textToDisplay="Sorry, This order has been cancelled" />
    );
  }

  if (orderData && orderData.status === "COMPLETE") {
    return (
      <OrderNotAllowedScreen textToDisplay="Sorry, This order has been completed" />
    );
  }

  return (
    <OrderContext.Provider
      value={{
        orderData,
        isLoading,
        refreshCheckout,
        setOrderForEdition,
        cancelIncompleteOrder,
        processCheckout,
        footerText,
        isProcessing,
        isDisabled,
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
