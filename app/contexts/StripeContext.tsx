import {
  PresentPaymentSheetResult,
  StripeProvider,
  initPaymentSheet,
  usePaymentSheet,
} from "@stripe/stripe-react-native";
import { createContext, useCallback, useContext } from "react";
import { MERCHANT_ID, PUBLISHABLE_KEY } from "../constants/config";
import { CustomerType } from "../constants/types";

export type StripeContextType = {
  initPayment: (
    customer: CustomerType,
    stripeCustomerId: string | undefined,
    ephemeralKey: string,
    clientSecret: string
  ) => Promise<void>;
  confirmPayment: () => Promise<PresentPaymentSheetResult | Error>;
};

const StripeContext = createContext<StripeContextType>({
  initPayment: (
    customer: CustomerType,
    stripeCustomerId: string | undefined,
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
      customer: CustomerType,
      stripeCustomerId: string | undefined,
      ephemeralKey: string,
      clientSecret: string
    ) => {
      // The ephemeral key only works with the Stripe customer of the payment (orders { payment { customer } })
      const savedCards = stripeCustomerId
        ? { customerId: stripeCustomerId, customerEphemeralKeySecret: ephemeralKey }
        : {};
      const paymentSheetResponse = await initPaymentSheet({
        ...savedCards,
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "My Fake Ecommerce",
        returnURL: "myapp://stripe-redirect",
        defaultBillingDetails: {
          name: customer.name,
          email: customer.email,
        },
      });
      if (paymentSheetResponse.error) {
        throw new Error(paymentSheetResponse.error.message);
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
