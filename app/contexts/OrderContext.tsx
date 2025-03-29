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
  selectSelectedOrderId,
} from "../redux/order/selectors";
import { useStripeContext } from "./StripeContext";

export type OrderContextType = {
  orderId: string | undefined;
  orderData: OrderType | undefined;
  refreshCheckout: () => void;
  updateOrder: () => void;
  setOrderForEdition: () => void;
  cancelIncompleteOrder: () => void;
  completeOrder: () => void;
  isLoading: boolean;
  isUpdating: boolean;
  isCreatingPayment: boolean;
};

const OrderContext = createContext<OrderContextType>({
  orderId: undefined,
  orderData: undefined,
  refreshCheckout: () => {},
  updateOrder: () => {},
  setOrderForEdition: () => {},
  cancelIncompleteOrder: () => {},
  completeOrder: () => {},
  isLoading: false,
  isUpdating: false,
  isCreatingPayment: false,
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
  } = useOrder();
  const { confirmPayment, initPayment } = useStripeContext();
  const dispatch = useAppDispatch();
  const customerData = useAppSelector(selectCustomerData());
  const addressData = useAppSelector(selectAddressData());
  const orderData: OrderType | undefined =
    orders && orders.length && orders.length === 1 ? orders[0] : undefined;

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
                    refetchOrder();
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
        orderId,
        orderData,
        isLoading,
        refreshCheckout,
        updateOrder,
        isUpdating,
        setOrderForEdition,
        cancelIncompleteOrder,
        completeOrder,
        isCreatingPayment,
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
