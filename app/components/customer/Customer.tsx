import React, { useMemo } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useOrderContext } from "../../contexts/OrderContext";
import UserDetailsForm from "../forms/UserDetailsForm";

const Customer = () => {
  const { orderData } = useOrderContext();

  const userData = useMemo(() => {
    return {
      email: orderData?.customer?.email || "",
      name: orderData?.customer?.name || "",
      phone: orderData?.customer?.phone || "",
    };
  }, [orderData]);

  return (
    <KeyboardAwareScrollView
      bottomOffset={100}
      showsVerticalScrollIndicator={false}
      testID="Customer.Container"
    >
      <UserDetailsForm data={userData} />
    </KeyboardAwareScrollView>
  );
};

export default Customer;
