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
} from "../redux/order/selectors";
import { formatCurrency } from "../utils/formatCurrency";
import { useStripeContext } from "./StripeContext";

export type OrderContextType = {
  orderData: OrderType | undefined;
  reloadOrder: () => void;
  returnOrderToCart: () => void;
  cancelOrder: () => void;
  isLoading: boolean;
  processCheckout: () => void;
  footerText: string;
  isProcessing: boolean;
  isDisabled: boolean;
  returnFromConfirmation: () => void;
};

const OrderContext = createContext<OrderContextType>({
  orderData: undefined,
  reloadOrder: () => {},
  returnOrderToCart: () => {},
  cancelOrder: () => {},
  isLoading: false,
  processCheckout: () => {},
  footerText: "",
  isProcessing: false,
  isDisabled: false,
  returnFromConfirmation: () => {},
});

export type OrderStoreContextType = PropsWithChildren & {
  orderId: string;
};

const OrderStore = ({ children, orderId }: OrderStoreContextType) => {
  const navigation = useAppNavigation();
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
  const isProcessing = isUpdating || isLoading || isCreatingPayment;
  const isDisabled = !isCustomerDataValid || !isAddressDataValid;

  useEffect(() => {
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
    return () => {};
  }, [dispatch, orderData]);

  const getFooterText = () => {
    if (orderData?.status === "COMPLETE") return "Return to Home";
    if (orderData?.status === "PAYMENT_PENDING")
      return `Complete Your Payment for ${formatCurrency(
        orderData.totals.total
      )}`;
    return "Confirm Your Order Information";
  };

  const reloadOrder = () => {
    if (!orderData) return;
    refetchOrder();
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

  const cancelOrder = () => {
    Alert.alert("Cancel this order?", "", [
      {
        text: "OK",
        onPress: () => cancelIncompleteOrder(),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  const setOrderForEdition = () => {
    if (!orderData) return;
    updateExistingOrder({
      id: orderData.id,
      customer: null,
      address: null,
      status: "INCOMPLETE",
    })
      .then(() => {
        if (orderData.details.length > 0) {
          dispatch(setCartFromOrder(orderData.details));
        }
        navigation.navigate("Products");
        return;
      })
      .catch((error) => Alert.alert(error));
  };

  const returnOrderToCart = () => {
    Alert.alert("Do you wish to modify this order?", "", [
      {
        text: "OK",
        onPress: () => setOrderForEdition(),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
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
                      routes: [
                        {
                          name: "Confirmation",
                          params: { orderId: orderData.id },
                        },
                      ],
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

  const returnFromConfirmation = () => {
    dispatch(resetCart());
    dispatch(setSelectedOrderId(undefined));
    refetchIncompleteOrders().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Products" }],
      });
      return;
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (orderData?.status === "CANCELLED") {
    return (
      <OrderNotAllowedScreen textToDisplay="Sorry, This order has been cancelled" />
    );
  }

  return (
    <OrderContext.Provider
      value={{
        orderData,
        isLoading,
        reloadOrder,
        returnOrderToCart,
        cancelOrder,
        processCheckout,
        returnFromConfirmation,
        footerText: getFooterText(),
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
