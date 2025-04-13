import React from "react";
import { useOrderContext } from "../../contexts/OrderContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CustomerFooter = () => {
  const { isProcessing, updateOrderCustomer, isCustomerValid } =
    useOrderContext();

  return (
    <CustomFooter>
      <FooterButton
        text={"Continue"}
        onPress={updateOrderCustomer}
        isLoading={isProcessing}
        disabled={!isCustomerValid || isProcessing}
        testID="CustomerScreen.Footer"
      />
    </CustomFooter>
  );
};

export default CustomerFooter;
