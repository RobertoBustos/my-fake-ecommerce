import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import UserDetailsForm from "../forms/UserDetailsForm";

const Customer = () => {
  return (
    <KeyboardAwareScrollView
      bottomOffset={100}
      showsVerticalScrollIndicator={false}
      testID="Customer.Container"
    >
      <UserDetailsForm />
    </KeyboardAwareScrollView>
  );
};

export default Customer;
