import { TotalsType } from "../constants/types";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

export type OrderSummaryPropsType = {
  data: TotalsType | null;
  isLoading?: boolean;
};

const OrderSummary = ({ data, isLoading }: OrderSummaryPropsType) => {
  if (data === null) {
    return null;
  }

  return (
    <CustomCard
      headerText="Order Summary"
      isLoading={isLoading}
      testID="OrderSummary.Container"
    >
      <SummaryCardRow
        concept={`${data.items} items`}
        value={formatCurrency(data.subTotal)}
        testID="OrderSummary.SubTotal"
      />
      <SummaryCardRow
        concept={`Taxes`}
        value={formatCurrency(data.taxes)}
        testID="OrderSummary.Taxes"
      />
      <SummaryCardRow
        concept={`Discount`}
        value={formatCurrency(data.discount)}
        testID="OrderSummary.Discount"
      />
      <SummaryCardRow
        concept={`Total`}
        value={formatCurrency(data.total)}
        testID="OrderSummary.Total"
      />
    </CustomCard>
  );
};

export default OrderSummary;
