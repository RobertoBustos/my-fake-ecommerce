import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Map from "../Map";
import AddressDetailsForm from "../forms/AddressDetailsForm";

const Address = () => {
  return (
    <KeyboardAwareScrollView
      bottomOffset={100}
      showsVerticalScrollIndicator={false}
      testID="Address.Container"
      keyboardShouldPersistTaps="always"
    >
      <AddressDetailsForm />
      <Map />
    </KeyboardAwareScrollView>
  );
};

export default Address;
