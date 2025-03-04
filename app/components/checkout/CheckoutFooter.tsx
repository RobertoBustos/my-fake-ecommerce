import { useCheckoutContext } from "@/app/contexts/CheckoutContext";
import { useStripeContext } from "@/app/contexts/StripeContext";
import { useAppNavigation } from "@/app/hooks/useAppNavigation";
import { useOrder } from "@/app/hooks/useOrder";
import { formatCurrency } from "@/app/utils/formatCurrency";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CheckoutFooter = () => {
  const {
    isLoading,
    isPaymentSheetReady,
    initializePaymentSheet,
    confirmPayment,
  } = useStripeContext();
  const { isValidUser } = useCheckoutContext();
  const { createOrder } = useOrder();
  const navigation = useAppNavigation();

  if (isPaymentSheetReady) {
    const handleConfirmPayment = () => {
      confirmPayment().then(() => {
        navigation.navigate("Confirmation");
      });
    };
    return (
      <CustomFooter>
        <FooterButton
          text={`Complete Payment Info`}
          disabled={isLoading}
          onPress={handleConfirmPayment}
          isLoading={isLoading}
        />
      </CustomFooter>
    );
  }

  const order = createOrder();
  const handlePaymentIntentCreation = () => {
    initializePaymentSheet(order);
  };

  return order ? (
    <CustomFooter>
      <FooterButton
        text={`Prepare Payment for  ${formatCurrency({
          amount: order.payment!.amount,
          currency: "MXN",
        })}`}
        disabled={!isPaymentSheetReady && !isValidUser}
        onPress={handlePaymentIntentCreation}
        isLoading={isLoading}
      />
    </CustomFooter>
  ) : null;
};

export default CheckoutFooter;
