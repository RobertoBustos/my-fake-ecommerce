import { useAppSelector } from "../redux/hooks";
import {
  selectIsOrderLoading,
  selectOrderData,
  selectOrderSummaryData,
} from "../redux/order/selectors";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

const OrderSummary = () => {
  const orderData = useAppSelector(selectOrderData);
  const orderSumaryData = useAppSelector(selectOrderSummaryData);
  const isLoading = useAppSelector(selectIsOrderLoading);

  return orderSumaryData && orderSumaryData !== null && orderData !== null ? (
    <CustomCard headerText="Order Summary" isLoading={isLoading}>
      <SummaryCardRow
        concept={`Order id`}
        value={orderData.orderId.toString()}
      />
      <SummaryCardRow
        concept={`${orderSumaryData.details.length} items`}
        value={formatCurrency({
          amount: orderSumaryData.subtotal,
          currency: "MXN",
        })}
      />
      <SummaryCardRow
        concept={`Taxes`}
        value={formatCurrency({
          amount: orderSumaryData.taxes,
          currency: "MXN",
        })}
      />
      <SummaryCardRow
        concept={`Discount`}
        value={formatCurrency({
          amount: orderSumaryData.discount,
          currency: "MXN",
        })}
      />
      <SummaryCardRow
        concept={`Total`}
        value={formatCurrency({
          amount: orderSumaryData.total,
          currency: "MXN",
        })}
      />
    </CustomCard>
  ) : null;
};

export default OrderSummary;
