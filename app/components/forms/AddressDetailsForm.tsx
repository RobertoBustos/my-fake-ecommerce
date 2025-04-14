import { useEffect, useRef } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useStyles } from "react-native-unistyles";
import { GOOGLE_MAPS_API_KEY } from "../../constants/config";
import { useAppDispatch } from "../../redux/hooks";
import { setAddressCoords, setAddressData } from "../../redux/order/reducer";
import addressDetailsFormStyleSheet from "../../styles/components/AddressDetailsForm";
import { formatAddress } from "../../utils/formatAddress";
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
    <>
      <CustomCard isLoading={isLoading} testID="AddressDetailsForm.Container">
        <GooglePlacesAutocomplete
          ref={ref}
          debounce={700}
          placeholder="Search Your Address"
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log("details", details);
            ref.current?.setAddressText(details?.formatted_address);
            const values = formatAddress(details);
            dispatch(setAddressData(values));
            dispatch(
              setAddressCoords({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 2,
                longitudeDelta: 2,
              })
            );
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: "en",
          }}
          textInputProps={{
            testID: "AddressDetailsForm.SearchInput",
            placeholderTextColor: theme.colors.typography,
            multiline: true,
            numberOfLines: 4,
            style: styles.input,
          }}
        />
      </CustomCard>
      <GooglePlacesAutocomplete
        ref={ref}
        debounce={700}
        placeholder="Search Your Address"
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log("details", details);
          ref.current?.setAddressText(details?.formatted_address);
          const values = formatAddress(details);
          dispatch(setAddressData(values));
          dispatch(
            setAddressCoords({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 2,
              longitudeDelta: 2,
            })
          );
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
        }}
        textInputProps={{
          testID: "AddressDetailsForm.SearchInput",
          placeholderTextColor: theme.colors.typography,
          multiline: true,
          numberOfLines: 4,
          style: styles.input,
        }}
      />
    </>
  );
};

export default AddressDetailsForm;
