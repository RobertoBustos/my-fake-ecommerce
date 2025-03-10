import {
  PresentPaymentSheetResult,
  StripeProvider,
  usePaymentSheet,
} from "@stripe/stripe-react-native";
import { createContext, useCallback, useContext } from "react";
import { MERCHANT_ID, PUBLISHABLE_KEY } from "../constants/config";

export type StripeContextType = {
  confirmPayment: () => Promise<PresentPaymentSheetResult | Error>;
};

const StripeContext = createContext<StripeContextType>({
  confirmPayment: () => new Promise(() => {}),
});

export type StripeStorePropsType = {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
};

const StipeStore = ({ children }: StripeStorePropsType) => {
  const { presentPaymentSheet } = usePaymentSheet();

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
