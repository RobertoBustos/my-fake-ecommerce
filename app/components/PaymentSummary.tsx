import { PaymentMethodType } from "../constants/types";
import CardPaymentSummary from "./CardPaymentSummary";

export type PaymentSummaryPropsType = {
  data: PaymentMethodType;
};

const PaymentSummary = ({ data }: PaymentSummaryPropsType) => {
  if (!data) {
    return null;
  }

  return data !== null ? (
    <CardPaymentSummary
      brand={data.card.brand}
      size={80}
      last4={data.card.last4}
      expMonth={data.card.exp_month}
      expYear={data.card.exp_year}
      autorization={data.card.fingerprint}
    />
  ) : null;
};

export default PaymentSummary;
