import { CustomerType } from "../constants/types";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

export type CustomerSummaryPropsType = {
  data: CustomerType | null;
  isLoading: boolean;
};

const CustomerSummary = ({ data, isLoading }: CustomerSummaryPropsType) => {
  if (data === null) {
    return null;
  }

  return (
    <CustomCard headerText="Customer Information" isLoading={isLoading}>
      <SummaryCardRow concept={"Customer Id"} value={data.customerId} />
      <SummaryCardRow concept={"Email"} value={data.email} />
      <SummaryCardRow concept={"Full Name"} value={data.userName} />
    </CustomCard>
  );
};

export default CustomerSummary;
