import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { createContext, useCallback, useContext, useState } from "react";
import { Alert } from "react-native";
import { MERCHANT_ID, PUBLISHABLE_KEY } from "../constants/config";
import { OrderType } from "../constants/types";
import { fetchPaymentSheetParams } from "../services/paymentServices";

export type StripeContextType = {
  isLoading: boolean;
  isPaymentSheetReady: boolean;
  initializePaymentSheet: (order: OrderType) => Promise<void>;
  confirmPayment: () => Promise<boolean | Error>;
};

const StripeContext = createContext<StripeContextType>({
  isLoading: false,
  isPaymentSheetReady: false,
  initializePaymentSheet: () => new Promise(() => {}),
  confirmPayment: () => new Promise(() => {}),
});

export type StripeStorePropsType = {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
};

const StipeStore = ({ children }: StripeStorePropsType) => {
  const [isPaymentSheetReady, setIsPaymentSheetReady] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  const initializePaymentSheet = useCallback(async (order: OrderType) => {
    setIsLoading(true);
    try {
      if (order.user === null || order.payment === null) {
        throw new Error("Error getting order information");
      }
      const response = await fetchPaymentSheetParams(order);
      if ("message" in response) {
        throw new Error(response.message);
      }
      const { error } = await initPaymentSheet({
        customerId: response.customer,
        customerEphemeralKeySecret: response.ephemeralKey,
        paymentIntentClientSecret: response.paymentIntent,
        merchantDisplayName: "My Fake Ecommerce",
        allowsDelayedPaymentMethods: true,
        returnURL: "stripe-example://stripe-redirect",
        defaultBillingDetails: {
          name: `${order.user.firstName} ${order.user.lastName}`,
        },
      });

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
        return;
      }
      setIsPaymentSheetReady(true);
    } catch (error) {
      Alert.alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async () => {
    try {
      const response = await presentPaymentSheet();
      const { error } = response;
      if (error) {
        throw new Error(error.message);
      }
      return true as boolean;
    } catch (error) {
      return error as Error;
    }
  }, []);

  if (!PUBLISHABLE_KEY) {
    return children;
  }

  return (
    <StripeContext.Provider
      value={{
        isLoading,
        isPaymentSheetReady,
        initializePaymentSheet,
        confirmPayment,
      }}
    >
      <StripeProvider
        publishableKey={PUBLISHABLE_KEY}
        merchantIdentifier={MERCHANT_ID}
      >
        {children}
      </StripeProvider>
    </StripeContext.Provider>
  );
};

export const useStripeContext = () => {
  return useContext(StripeContext);
};

export default StipeStore;
