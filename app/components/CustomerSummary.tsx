import { CustomerType } from "../constants/types";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

export type CustomerSummaryPropsType = {
  data: CustomerType | null;
  isLoading?: boolean;
};

const CustomerSummary = ({ data, isLoading }: CustomerSummaryPropsType) => {
  if (data === null) {
    return null;
  }

  return (
    <CustomCard headerText="Customer Information" isLoading={isLoading}>
      <SummaryCardRow concept={"Customer Id"} value={data.id} />
      <SummaryCardRow concept={"Email"} value={data.email} />
      <SummaryCardRow concept={"Full Name"} value={data.name} />
    </CustomCard>
  );
};

export default CustomerSummary;
