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
    <CustomCard headerText="Order Summary" isLoading={isLoading}>
      <SummaryCardRow
        concept={`${data.items} items`}
        value={formatCurrency(data.subTotal)}
      />
      <SummaryCardRow concept={`Taxes`} value={formatCurrency(data.taxes)} />
      <SummaryCardRow
        concept={`Discount`}
        value={formatCurrency(data.discount)}
      />
      <SummaryCardRow concept={`Total`} value={formatCurrency(data.total)} />
    </CustomCard>
  );
};

export default OrderSummary;
