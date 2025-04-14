import React, { useEffect, useRef } from "react";
import { GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useOrderContext } from "../../contexts/OrderContext";
import Map from "../Map";
import AddressDetailsForm from "../forms/AddressDetailsForm";

const Address = () => {
  const { orderData } = useOrderContext();
  const ref = useRef<GooglePlacesAutocompleteRef>(null);

  useEffect(() => {
    if (!orderData || orderData.address === null) return;
    ref.current?.setAddressText(orderData.address.address);
  }, [orderData]);

  return (
    <KeyboardAwareScrollView
      bottomOffset={100}
      showsVerticalScrollIndicator={false}
      testID="Address.Container"
    >
      <AddressDetailsForm address={orderData?.address?.address} />
      <Map />
    </KeyboardAwareScrollView>
  );
};

export default Address;
