import { useAppDispatch } from "@/app/redux/hooks";
import { setAddressData } from "@/app/redux/order/reducer";
import addressDetailsFormStyleSheet from "@/app/styles/components/AddressDetailsForm";
import { formatAddress } from "@/app/utils/formatAddress";
import { useEffect, useRef } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useStyles } from "react-native-unistyles";
import { GOOGLEMAPS_API_KEY } from "../../constants/config";
import CustomCard from "../common/CustomCard";

export type AddressDetailsFormPropsType = {
  address?: string;
  isLoading?: boolean;
};

const AddressDetailsForm = ({
  address,
  isLoading,
}: AddressDetailsFormPropsType) => {
  const dispatch = useAppDispatch();
  const { styles, theme } = useStyles(addressDetailsFormStyleSheet);
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    if (!address) return;
    ref.current?.setAddressText(address);
  }, [address]);

  return (
    <CustomCard isLoading={isLoading} testID="AddressDetailsForm.Container">
      <GooglePlacesAutocomplete
        ref={ref}
        debounce={700}
        placeholder="Search Your Address"
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details === null) return;
          const values = formatAddress(details);
          dispatch(setAddressData(values));
        }}
        query={{
          key: GOOGLEMAPS_API_KEY,
          language: "en",
        }}
        textInputProps={{
          testID: "Address.SearchInput",
          placeholderTextColor: theme.colors.typography,
          multiline: true,
          numberOfLines: 4,
          style: styles.input,
        }}
      />
    </CustomCard>
  );
};

export default AddressDetailsForm;
