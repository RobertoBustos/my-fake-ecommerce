import { createSelector } from "@reduxjs/toolkit";
import { RootStateType } from "../types";

export const selectOrderState = (state: RootStateType) => state.order

export const selectCustomerData = () => {
    return createSelector([selectOrderState], (orderState) => {
        return {
            customerId: orderState.customerData?.id || "",
            email: orderState.customerData?.email || "",
            name: orderState.customerData?.name || ""
        }
    }
    );
}

export const selectIsCustomerDataValid = () => {
    return createSelector([selectCustomerData()], (customerData) => {
        return customerData.email !== "" && customerData.name !== ""
    }
    );
}

export const selectAddressData = () => {
    return createSelector([selectOrderState], (orderState) => {
        return {
            address: orderState.addressData?.address || "",
            zipCode: orderState.addressData?.zipCode || "",
        }
    }
    );
}

export const selectIsAddressDataValid = () => {
    return createSelector([selectAddressData()], (addressData) => {
        return addressData.address !== "" && addressData.zipCode.length === 5
    }
    );
}

export const selectSelectedOrderId = (state: RootStateType) => state.order.selectedOrderId

export default {}