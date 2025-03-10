import { useAppSelector } from "../redux/hooks";
import {
  selectCustomerData,
  selectIsOrderLoading,
} from "../redux/order/selectors";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

const CustomerSummary = () => {
  const customerData = useAppSelector(selectCustomerData());
  const isLoading = useAppSelector(selectIsOrderLoading);

  return (
    <CustomCard headerText="Customer Information" isLoading={isLoading}>
      <SummaryCardRow concept={"Customer Id"} value={customerData.customerId} />
      <SummaryCardRow concept={"Email"} value={customerData.email} />
      <SummaryCardRow concept={"Full Name"} value={customerData.userName} />
    </CustomCard>
  );
};

export default CustomerSummary;
