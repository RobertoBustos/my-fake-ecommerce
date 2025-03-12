import { CartSummaryType } from "../constants/types";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

export type OrderSummaryPropsType = {
  data: CartSummaryType | null;
  isLoading?: boolean;
};

const OrderSummary = ({ data, isLoading }: OrderSummaryPropsType) => {
  if (data === null) {
    return null;
  }

  return (
    <CustomCard headerText="Order Summary" isLoading={isLoading}>
      <SummaryCardRow
        concept={`${data.details.length} items`}
        value={formatCurrency({
          amount: data.subtotal,
          currency: "MXN",
        })}
      />
      <SummaryCardRow
        concept={`Taxes`}
        value={formatCurrency({
          amount: data.taxes,
          currency: "MXN",
        })}
      />
      <SummaryCardRow
        concept={`Discount`}
        value={formatCurrency({
          amount: data.discount,
          currency: "MXN",
        })}
      />
      <SummaryCardRow
        concept={`Total`}
        value={formatCurrency({
          amount: data.total,
          currency: "MXN",
        })}
      />
    </CustomCard>
  );
};

export default OrderSummary;
