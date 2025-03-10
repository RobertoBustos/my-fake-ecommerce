import { PaymentMethodType } from "../constants/types";
import CardPaymentSummary from "./CardPaymentSummary";

export type PaymentSummaryPropsType = {
  data: PaymentMethodType | null;
  isLoading: boolean;
};

const PaymentSummary = ({ data, isLoading }: PaymentSummaryPropsType) => {
  if (!data) {
    return null;
  }

  return data !== null && data.type === "card" && data.card ? (
    <CardPaymentSummary
      size={80}
      last4={data.card.last4}
      expMonth={data.card.exp_month}
      expYear={data.card.exp_year}
      autorization={data.card.fingerprint}
      isLoading={isLoading}
    />
  ) : null;
};

export default PaymentSummary;
