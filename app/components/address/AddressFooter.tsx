import React from "react";
import { useOrderContext } from "../../contexts/OrderContext";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const AddressFooter = () => {
  const { isProcessing, updateOrderAddress, isAddressValid } =
    useOrderContext();

  return (
    <CustomFooter>
      <FooterButton
        text={"Continue"}
        onPress={updateOrderAddress}
        isLoading={isProcessing}
        disabled={!isAddressValid || isProcessing}
        testID="AddressScreen.Footer"
      />
    </CustomFooter>
  );
};

export default AddressFooter;
