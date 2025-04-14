import { AddressType } from "../constants/types";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

export type AddressSummaryPropsType = {
  data: AddressType | null;
  isLoading?: boolean;
  onPress?: () => void;
};

const AddressSummary = ({
  data,
  isLoading,
  onPress,
}: AddressSummaryPropsType) => {
  let showEditLabel = false;

  if (onPress) {
    showEditLabel = true;
  }

  if (data === null) {
    return null;
  }

  return (
    <CustomCard
      headerText="Address Information"
      isLoading={isLoading}
      testID="AddressSummary.Container"
      onPress={onPress}
      showEditLabel={showEditLabel}
    >
      <SummaryCardRow value={data.address} testID="AddressSummary.Address" />
    </CustomCard>
  );
};

export default AddressSummary;
