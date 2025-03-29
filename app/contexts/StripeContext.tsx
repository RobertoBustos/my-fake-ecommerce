import {
  PresentPaymentSheetResult,
  StripeProvider,
  initPaymentSheet,
  usePaymentSheet,
} from "@stripe/stripe-react-native";
import { createContext, useCallback, useContext } from "react";
import { MERCHANT_ID, PUBLISHABLE_KEY } from "../constants/config";
import { OrderType } from "../constants/types";

export type StripeContextType = {
  initPayment: (
    orderData: OrderType,
    ephemeralKey: string,
    clientSecret: string
  ) => Promise<boolean | Error>;
  confirmPayment: () => Promise<PresentPaymentSheetResult | Error>;
};

const StripeContext = createContext<StripeContextType>({
  initPayment: (
    orderData: OrderType,
    ephemeralKey: string,
    clientSecret: string
  ) => new Promise(() => {}),
  confirmPayment: () => new Promise(() => {}),
});

export type StripeStorePropsType = {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
};

const StipeStore = ({ children }: StripeStorePropsType) => {
  const { presentPaymentSheet } = usePaymentSheet();

  const initPayment = useCallback(
    async (
      orderData: OrderType,
      ephemeralKey: string,
      clientSecret: string
    ) => {
      try {
        if (!orderData || orderData.customer === null) {
          throw new Error("Order not found");
        }
        const paymentSheetResponse = await initPaymentSheet({
          customerId: orderData.customer.id,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "My Fake Ecommerce",
          allowsDelayedPaymentMethods: true,
          returnURL: "stripe-example://stripe-redirect",
          defaultBillingDetails: {
            name: orderData.customer.name,
            email: orderData.customer.email,
          },
        });
        if (paymentSheetResponse.error) {
          return false;
        }
        return true;
      } catch (error) {
        return error as Error;
      }
    },
    []
  );

  const confirmPayment = useCallback(async () => {
    try {
      const response = await presentPaymentSheet();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response;
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
        initPayment,
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
