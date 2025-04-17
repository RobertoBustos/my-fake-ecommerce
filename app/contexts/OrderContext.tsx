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
  returnFromConfirmation: () => void;
  updateOrderAddress: () => void;
  isAddressValid: boolean;
  updateOrderCustomer: () => void;
  isCustomerValid: boolean;
  editCustomerRedirect: () => void;
  editAddressRedirect: () => void;
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
  returnFromConfirmation: () => {},
  updateOrderAddress: () => {},
  isAddressValid: false,
  updateOrderCustomer: () => {},
  isCustomerValid: false,
  editCustomerRedirect: () => {},
  editAddressRedirect: () => {},
});

export type OrderStoreContextType = PropsWithChildren & {
  orderId: string;
  forceGoBack?: boolean;
};

const OrderStore = ({
  children,
  orderId,
  forceGoBack,
}: OrderStoreContextType) => {
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
  } = useOrder();
  const { confirmPayment, initPayment } = useStripeContext();
  const dispatch = useAppDispatch();
  const customerData = useAppSelector(selectCustomerData());
  const addressData = useAppSelector(selectAddressData());
  const isCustomerValid = useAppSelector(selectIsCustomerDataValid());
  const isAddressValid = useAppSelector(selectIsAddressDataValid());
  const orderData: OrderType | undefined =
    orders && orders.length && orders.length === 1 ? orders[0] : undefined;
  const isProcessing = isUpdating || isLoading || isCreatingPayment;

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
          phone: orderData.customer.phone,
        })
      );
    }
    if (orderData && orderData.address !== null) {
      dispatch(
        setAddressData({
          address: orderData.address.address,
          zipCode: orderData.address.zipCode,
          coords: {
            latitude: orderData.address.coords.latitude,
            latitudeDelta: orderData.address.coords.latitudeDelta,
            longitude: orderData.address.coords.longitude,
            longitudeDelta: orderData.address.coords.longitudeDelta,
          },
        })
      );
    }
    return () => {};
  }, [dispatch, orderData]);

  const getFooterText = () => {
    if (forceGoBack && forceGoBack === true) {
      return "Save";
    }
    if (orderData?.status === "COMPLETE") return "Return to Home";
    if (orderData?.status === "PAYMENT_PENDING")
      return `Complete Your Payment for ${formatCurrency(
        orderData.totals.total
      )}`;
    return "Continue";
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
      .then((order) => {
        if (order.details.length > 0) {
          dispatch(setCartFromOrder(order.details));
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

  const updateOrderAddress = () => {
    if (!orderData || !addressData.coords) return;
    updateExistingOrder({
      id: orderData.id,
      customer: null,
      address: {
        address: addressData.address,
        zipCode: addressData.zipCode,
        coords: addressData.coords,
      },
      status: null,
    })
      .then((order) => {
        if (forceGoBack && forceGoBack === true) {
          return navigation.goBack();
        }
        return navigation.navigate("Checkout", { orderId: order.id });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  const updateOrderCustomer = () => {
    if (!orderData) return;
    updateExistingOrder({
      id: orderData.id,
      customer: {
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
      },
      address: null,
      status: null,
    })
      .then((order) => {
        if (forceGoBack && forceGoBack === true) {
          return navigation.goBack();
        }
        if (order.status === "PAYMENT_PENDING") {
          return navigation.navigate("Checkout", { orderId: order.id });
        }
        return navigation.navigate("Address", { orderId: order.id });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  const completeOrder = () => {
    if (!orderData) return;
    createPayment({ orderId: orderData.id })
      .then((payment) => {
        initPayment(orderData, payment.ephimeralKey, payment.clientSecret)
          .then(() => {
            confirmPayment()
              .then(() => {
                updateExistingOrder({
                  id: orderData.id,
                  customer: null,
                  address: null,
                  status: "COMPLETE",
                })
                  .then((order) => {
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: "Confirmation",
                          params: { orderId: order.id },
                        },
                      ],
                    });
                  })
                  .catch((error) => {
                    Alert.alert(error.message);
                  });
              })
              .catch((error) => {
                Alert.alert(error.message);
              });
          })
          .catch((error) => {
            Alert.alert(error.message);
          });
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  const processCheckout = () => {
    if (!orderData) return;
    completeOrder();
  };

  const returnFromConfirmation = () => {
    dispatch(resetCart());
    dispatch(setSelectedOrderId(undefined));
    navigation.reset({
      index: 0,
      routes: [{ name: "Products" }],
    });
    return;
  };

  const editCustomerRedirect = () => {
    if (!orderData) return;
    return navigation.navigate("Customer", {
      orderId: orderData.id,
      goBack: true,
    });
  };

  const editAddressRedirect = () => {
    if (!orderData) return;
    return navigation.navigate("Address", {
      orderId: orderData.id,
      goBack: true,
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
        updateOrderAddress,
        isAddressValid,
        updateOrderCustomer,
        isCustomerValid,
        editCustomerRedirect,
        editAddressRedirect,
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
