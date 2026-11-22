import { useCallback, useEffect, useRef } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useUnistyles } from "react-native-unistyles";
import { GOOGLE_MAPS_API_KEY } from "../../constants/config";
import { useOrderContext } from "../../contexts/OrderContext";
import useLocation from "../../hooks/useLocation";
import { useAppDispatch } from "../../redux/hooks";
import { setAddressData } from "../../redux/order/reducer";
import styles from "../../styles/components/AddressDetailsForm";
import { formatAddress } from "../../utils/formatAddress";
import CustomCard from "../common/CustomCard";

const AddressDetailsForm = () => {
  const dispatch = useAppDispatch();
  const { theme } = useUnistyles();
  const ref = useRef<GooglePlacesAutocompleteRef>(null);
  const { getFormatedAddress } = useLocation();
  const { orderData } = useOrderContext();

  const getLocationAddress = useCallback(() => {
    getFormatedAddress().then((address) => {
      if (!address) return;
      ref.current?.setAddressText(address.address);
      dispatch(setAddressData(address));
    });
    return () => {};
  }, [dispatch, getFormatedAddress]);

  useEffect(() => {
    if (!orderData) {
      return;
    }
    if (orderData.address === null) {
      return getLocationAddress();
    }
    ref.current?.setAddressText(orderData.address.address);
    return () => {};
  }, [getLocationAddress, orderData]);

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
