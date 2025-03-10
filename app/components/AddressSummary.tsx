import { useAppSelector } from "../redux/hooks";
import {
  selectIsOrderLoading,
  selectShippingData,
} from "../redux/order/selectors";
import CustomCard from "./common/CustomCard";
import SummaryCardRow from "./common/SummaryCardRow";

const AddressSummary = () => {
  const addressData = useAppSelector(selectShippingData());
  const isLoading = useAppSelector(selectIsOrderLoading);

  return (
    <CustomCard headerText="Address Information" isLoading={isLoading}>
      <SummaryCardRow concept={"Address"} value={addressData.address} />
      <SummaryCardRow concept={"Zip Code"} value={addressData.zipCode} />
    </CustomCard>
  );
};

export default AddressSummary;
