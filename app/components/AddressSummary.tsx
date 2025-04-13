import { AddressType } from "../constants/types";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

export type AddressSummaryPropsType = {
  data: AddressType | null;
  isLoading?: boolean;
};

const AddressSummary = ({ data, isLoading }: AddressSummaryPropsType) => {
  if (data === null) {
    return null;
  }

  return (
    <CustomCard
      headerText="Address Information"
      isLoading={isLoading}
      testID="AddressSummary.Container"
    >
      <SummaryCardRow value={data.address} testID="AddressSummary.Address" />
    </CustomCard>
  );
};

export default AddressSummary;
