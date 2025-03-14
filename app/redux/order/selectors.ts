import { createSelector } from "@reduxjs/toolkit";
import { RootStateType } from "../types";

export const selectOrderState = (state: RootStateType) => state.order

export const selectIsOrderLoading = (state: RootStateType) => state.order.isFetching && !state.order.isRefreshing

export const selectIsPaymentLoading = (state: RootStateType) => state.order.isLoadingPayment

export const selectIsOrderRefreshing = (state: RootStateType) => state.order.isRefreshing

export const selectIsUpdating = (state: RootStateType) => state.order.isUpdating

export const selectCustomerData = () => {
    return createSelector([selectOrderState], (orderState) => {
        return {
            customerId: orderState.customerData?.customerId || "",
            email: orderState.customerData?.email || "",
            userName: orderState.customerData?.userName || ""
        }
    }
    );
}

export const selectIsCustomerDataValid = () => {
    return createSelector([selectCustomerData()], (customerData) => {
        return customerData.email !== "" && customerData.userName !== ""
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

export const selectIncompleteOrders = (state: RootStateType) => state.order.incompleteOrders

export const selectSelectedOrderId = (state: RootStateType) => state.order.selectedOrderId

export default {}