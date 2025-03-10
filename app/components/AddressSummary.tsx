import { ShippingType } from "../constants/types";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

export type AddressSummaryPropsType = {
  data: ShippingType | null;
  isLoading: boolean;
};

const AddressSummary = ({ data, isLoading }: AddressSummaryPropsType) => {
  if (data === null) {
    return null;
  }

  return (
    <CustomCard headerText="Address Information" isLoading={isLoading}>
      <SummaryCardRow concept={"Address"} value={data.address} />
      <SummaryCardRow concept={"Zip Code"} value={data.zipCode} />
    </CustomCard>
  );
};

export default AddressSummary;
