import { useEffect, useRef } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useStyles } from "react-native-unistyles";
import { GOOGLE_MAPS_API_KEY } from "../../constants/config";
import { useAppDispatch } from "../../redux/hooks";
import { setAddressData } from "../../redux/order/reducer";
import addressDetailsFormStyleSheet from "../../styles/components/AddressDetailsForm";
import { formatAddress } from "../../utils/formatAddress";
import CustomCard from "../common/CustomCard";

export type AddressDetailsFormPropsType = {
  address?: string;
};

const AddressDetailsForm = ({ address }: AddressDetailsFormPropsType) => {
  const dispatch = useAppDispatch();
  const { styles, theme } = useStyles(addressDetailsFormStyleSheet);
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    if (!address) return;
    ref.current?.setAddressText(address);
  }, [address]);

  return (
    <CustomCard orientation="horizontal" testID="AddressDetailsForm.Container">
      <GooglePlacesAutocomplete
        debounce={700}
        enablePoweredByContainer={false}
        fetchDetails={true}
        listViewDisplayed={false}
        minLength={5}
        onPress={(data, details = null) => {
          if (details === null) return;
          ref.current?.setAddressText(details?.formatted_address);
          const values = formatAddress(details);
          dispatch(setAddressData(values));
        }}
        placeholder="Search Your Address"
        keyboardShouldPersistTaps="always"
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
        }}
        ref={ref}
        textInputProps={{
          testID: "AddressDetailsForm.SearchInput",
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
