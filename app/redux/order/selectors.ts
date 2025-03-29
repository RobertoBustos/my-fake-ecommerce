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

export const selectShippingData = () => {
    return createSelector([selectOrderState], (orderState) => {
        return {
            address: orderState.shippingData?.address || "",
            zipCode: orderState.shippingData?.zipCode || "",
        }
    }
    );
}

export const selectIsShippingDataValid = () => {
    return createSelector([selectShippingData()], (shippingData) => {
        return shippingData.address !== "" && shippingData.zipCode !== ""
    }
    );
}

export const selectSelectedOrderId = (state: RootStateType) => state.order.selectedOrderId

export default {}