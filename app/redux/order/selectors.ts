import { createSelector } from "@reduxjs/toolkit";
import { PHONE_PATTERN, ZIP_CODE_PATTERN } from "../../constants/validation";
import { isSameLocation } from "../../utils/isSameLocation";
import { RootStateType } from "../types";

export const selectOrderState = (state: RootStateType) => state.order

export const selectAdressCoords = (state: RootStateType) => state.order.addressData?.coords

export const selectMapCenter = (state: RootStateType) => state.order.mapCenter

export const selectCustomerData = () => {
    return createSelector([selectOrderState], (orderState) => {
        return {
            customerId: orderState.customerData?.id || "",
            email: orderState.customerData?.email || "",
            name: orderState.customerData?.name || "",
            phone: orderState.customerData?.phone || ""
        }
    }
    );
}

export const selectIsCustomerDataValid = () => {
    return createSelector([selectCustomerData()], (customerData) => {
        return customerData.email !== "" && customerData.name !== "" && PHONE_PATTERN.test(customerData.phone)
    }
    );
}

export const selectAddressData = () => {
    return createSelector([selectOrderState], (orderState) => {
        return {
            address: orderState.addressData?.address || "",
            zipCode: orderState.addressData?.zipCode || "",
            coords: orderState.addressData?.coords || undefined
        }
    }
    );
}

export const selectIsAddressDataValid = () => {
    return createSelector([selectAddressData(), selectMapCenter], (addressData, mapCenter) => {
        // The user has to see the address on the map before continuing
        const isOnMap = addressData.coords !== undefined && mapCenter !== null &&
            isSameLocation(mapCenter, addressData.coords)
        return addressData.address !== "" && ZIP_CODE_PATTERN.test(addressData.zipCode.trim()) && isOnMap
    }
    );
}

export const selectSelectedOrderId = (state: RootStateType) => state.order.selectedOrderId

export default {}