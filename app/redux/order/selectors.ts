import { createSelector } from "@reduxjs/toolkit";
import { RootStateType } from "../types";

export const selectOrderState = (state: RootStateType) => state.order

export const selectOrderData = (state: RootStateType) => state.order.orderData

export const selectIsOrderLoading = (state: RootStateType) => state.order.isLoading

export const selectOrderSummaryData = (state: RootStateType) => state.order.orderData?.summary

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

export const selectIsOrderComplete = (state: RootStateType) => state.order.orderData?.status === "complete"

export const selectPaymentData = (state: RootStateType) => state.order.paymentData

export const selectIncompleteOrders = (state: RootStateType) => state.order.incompleteOrders