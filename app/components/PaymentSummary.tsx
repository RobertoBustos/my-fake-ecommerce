import { useAppSelector } from "../redux/hooks";
import { selectPaymentData } from "../redux/order/selectors";
import CardPaymentSummary from "./CardPaymentSummary";

const PaymentSummary = () => {
  const paymentData = useAppSelector(selectPaymentData);

  return paymentData !== null &&
    paymentData.type === "card" &&
    paymentData.card ? (
    <CardPaymentSummary
      size={80}
      last4={paymentData.card.last4}
      expMonth={paymentData.card.exp_month}
      expYear={paymentData.card.exp_year}
      autorization={paymentData.card.fingerprint}
    />
  ) : null;
};

export default PaymentSummary;
