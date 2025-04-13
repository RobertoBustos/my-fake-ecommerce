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
    <CustomCard
      headerText="Customer Information"
      isLoading={isLoading}
      testID="CustomerSummary.Container"
    >
      <SummaryCardRow
        concept={"Customer Id"}
        value={data.id}
        testID="CustomerSummary.CustomerId"
      />
      <SummaryCardRow
        concept={"Email"}
        value={data.email}
        testID="CustomerSummary.Email"
      />
      <SummaryCardRow
        concept={"Full Name"}
        value={data.name}
        testID="CustomerSummary.Name"
      />
      <SummaryCardRow
        concept={"Phone Number"}
        value={data.phone}
        testID="CustomerSummary.Phone"
      />
    </CustomCard>
  );
};

export default CustomerSummary;
