import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import OrderNotAllowedScreen from "../components/OrderNotAllowedScreen";
import LoadingScreen from "../components/common/LoadingScreen";
import { OrderType, Status } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import useCart from "../hooks/useCart";
import useOrder, { PaymentCreated } from "../hooks/useOrder";
import {
  renewCartId,
  resetCart,
  setCartFromOrder,
} from "../redux/cart/reducer";
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
import {
  ApiErrorCode,
  getErrorCode,
  getErrorExtensions,
  getErrorMessage,
} from "../utils/apiErrors";
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
  isDisabled: boolean;
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
  isDisabled: true,
});

// Attempts of createOrderPayment while recovering from expired reservations
const MAX_PAYMENT_ATTEMPTS = 3;

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
    fetchOrderDetails,
    fetchPaymentCustomer,
    waitForOrderCompletion,
  } = useOrder();
  const { addProduct, removeProduct } = useCart();
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const { confirmPayment, initPayment } = useStripeContext();
  const dispatch = useAppDispatch();
  const customerData = useAppSelector(selectCustomerData());
  const addressData = useAppSelector(selectAddressData());
  const isCustomerValid = useAppSelector(selectIsCustomerDataValid());
  const isAddressValid = useAppSelector(selectIsAddressDataValid());
  const orderData: OrderType | undefined =
    orders && orders.length && orders.length === 1 ? orders[0] : undefined;
  const isProcessing =
    isUpdating || isLoading || isCreatingPayment || isPaying;
  // The server moves the order to PAYMENT_PENDING once it has customer and address, only then it can be paid
  const isDisabled = orderData?.status !== Status.PAYMENT_PENDING;

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
        orderData.totals.total,
        orderData.totals.currency
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
        // The cart of a cancelled order can not be ordered again
        dispatch(renewCartId());
        dispatch(setSelectedOrderId(undefined));
        navigation.reset({
          index: 0,
          routes: [{ name: "Products" }],
        });
        return;
      })
      .catch((error) => Alert.alert(getErrorMessage(error)));
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

  // The order keeps its status, products are added to it with addToCart (orderId)
  const setOrderForEdition = () => {
    if (!orderData) return;
    if (orderData.details.length > 0) {
      dispatch(setCartFromOrder(orderData.details));
    }
    navigation.navigate("Products");
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
      address: {
        address: addressData.address,
        zipCode: addressData.zipCode,
        coords: {
          latitude: addressData.coords.latitude,
          longitude: addressData.coords.longitude,
          latitudeDelta: addressData.coords.latitudeDelta,
          longitudeDelta: addressData.coords.longitudeDelta,
        },
      },
    })
      .then((order) => {
        if (forceGoBack && forceGoBack === true) {
          return navigation.goBack();
        }
        return navigation.navigate("Checkout", { orderId: order.id });
      })
      .catch((error) => {
        Alert.alert(getErrorMessage(error));
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
        Alert.alert(getErrorMessage(error));
      });
  };

  // Reserves again the items whose 60 minutes reservation expired
  const reserveExpiredItems = async (order: OrderType, itemIds: string[]) => {
    const details = await fetchOrderDetails(order.id);
    for (const item of details.filter((detail) => itemIds.includes(detail.id))) {
      await removeProduct({ id: item.id });
      await addProduct({
        cartId: order.cart,
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      });
    }
  };

  const removeUnavailableProducts = async (
    order: OrderType,
    productIds: string[]
  ) => {
    const details = await fetchOrderDetails(order.id);
    for (const item of details.filter((detail) =>
      productIds.includes(detail.productId)
    )) {
      await removeProduct({ id: item.id });
    }
  };

  const reloadOrderForReview = async () => {
    const response = await refetchOrder();
    const order = response.data?.orders.edges[0]?.node;
    if (order) {
      dispatch(setCartFromOrder(order.details));
    }
    return order;
  };

  // createOrderPayment can refuse to charge (BAD_USER_INPUT) without charging anything.
  // Returns undefined when the user has to review the order before paying again
  const requestPayment = async (
    order: OrderType,
    attempt: number = 1
  ): Promise<PaymentCreated | undefined> => {
    try {
      return await createPayment({ orderId: order.id });
    } catch (error) {
      if (getErrorCode(error) !== ApiErrorCode.BAD_USER_INPUT) throw error;
      const { priceChanges, expiredItemIds, unavailableProductIds } =
        getErrorExtensions(error);
      if (expiredItemIds?.length && attempt < MAX_PAYMENT_ATTEMPTS) {
        await reserveExpiredItems(order, expiredItemIds);
        return requestPayment(order, attempt + 1);
      }
      if (expiredItemIds?.length) {
        await reloadOrderForReview();
        Alert.alert(
          "We could not reserve your products",
          "Please try to pay again in a moment"
        );
        return undefined;
      }
      if (unavailableProductIds?.length) {
        await removeUnavailableProducts(order, unavailableProductIds);
        await reloadOrderForReview();
        Alert.alert(
          "Some products are no longer available",
          "They were removed from your order, please review it and pay again"
        );
        return undefined;
      }
      if (priceChanges?.length) {
        // The order already has the new prices
        const updatedOrder = await reloadOrderForReview();
        Alert.alert(
          "Prices changed",
          updatedOrder
            ? `Your new total is ${formatCurrency(
                updatedOrder.totals.total,
                updatedOrder.totals.currency
              )}, review it and pay again`
            : "Review the new total and pay again"
        );
        return undefined;
      }
      throw error;
    }
  };

  const completeOrder = async () => {
    if (!orderData || orderData.customer === null) return;
    setIsPaying(true);
    try {
      const payment = await requestPayment(orderData);
      if (!payment) return;
      const stripeCustomerId = await fetchPaymentCustomer(orderData.id);
      await initPayment(
        orderData.customer,
        stripeCustomerId,
        payment.ephimeralKey,
        payment.clientSecret
      );
      await confirmPayment();
      // The Stripe webhook marks the order as COMPLETE, the client never does
      const status = await waitForOrderCompletion(orderData.id);
      if (status !== Status.COMPLETE) {
        Alert.alert(
          "Payment in process",
          "We are still confirming your payment, your order will be completed in a moment"
        );
      }
      // The cart of this order can not be ordered again
      dispatch(renewCartId());
      dispatch(setSelectedOrderId(undefined));
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Confirmation",
            params: { orderId: orderData.id },
          },
        ],
      });
    } catch (error) {
      Alert.alert(getErrorMessage(error));
    } finally {
      setIsPaying(false);
    }
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
        isDisabled,
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
