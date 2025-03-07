import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { createContext, useCallback, useContext, useState } from "react";
import { MERCHANT_ID, PUBLISHABLE_KEY } from "../constants/config";
import { useAppSelector } from "../redux/hooks";
import { selectOrderData } from "../redux/order/selectors";

export type StripeContextType = {
  isLoading: boolean;
  isPaymentSheetReady: boolean;
  initializePaymentSheet: () => Promise<void>;
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
  const order = useAppSelector(selectOrderData);

  const initializePaymentSheet = useCallback(async () => {
    setIsLoading(true);
    try {
      if (
        order === null ||
        order.customerData === null ||
        order.paymentIntent === null
      ) {
        throw new Error("Error getting order information");
      }

      const { error } = await initPaymentSheet({
        customerId: order.customerData.customerId,
        customerEphemeralKeySecret: order.paymentIntent.ephemeralKey,
        paymentIntentClientSecret: order.paymentIntent.clientSecret,
        merchantDisplayName: "My Fake Ecommerce",
        allowsDelayedPaymentMethods: true,
        returnURL: "stripe-example://stripe-redirect",
        defaultBillingDetails: {
          name: order.customerData.userName,
          email: order.customerData.email,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      setIsPaymentSheetReady(true);
    } catch (error) {
      throw error as Error;
    } finally {
      setIsLoading(false);
    }
  }, [initPaymentSheet, order]);

  const confirmPayment = useCallback(async () => {
    try {
      const response = await presentPaymentSheet();
      const { error } = response;
      if (error) {
        throw new Error(error.message);
      }
      return true as boolean;
    } catch (error) {
      throw error as Error;
    }
  }, [presentPaymentSheet]);

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
