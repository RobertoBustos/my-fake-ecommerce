import { GOOGLEMAPS_API_KEY } from "@env";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { useStyles } from "react-native-unistyles";
import { useOrderContext } from "../../contexts/OrderContext";
import { useAppDispatch } from "../../redux/hooks";
import { setAddressData } from "../../redux/order/reducer";
import addressStyleSheet from "../../styles/components/Address";
import { formatAddress } from "../../utils/formatAddress";

const Address = () => {
  const dispatch = useAppDispatch();
  const { styles, theme } = useStyles(addressStyleSheet);
  const { orderData } = useOrderContext();
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    if (!orderData || orderData.address === null) return;
    ref.current?.setAddressText(orderData.address.address);
  }, [orderData]);

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default Address;
