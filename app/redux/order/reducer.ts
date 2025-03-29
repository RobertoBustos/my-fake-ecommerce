import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AddressType, UserType } from "../../constants/types";
import { OrderStateType } from "../types";

const initialState: OrderStateType = {
    selectedOrderId: undefined,
    customerData: null,
    shippingData: null,
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setSelectedOrderId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedOrderId = action.payload
        },
        setCustomerData: (state, action: PayloadAction<UserType>) => {
            state.customerData = { ...action.payload, id: "" }
        },
        setShippingData: (state, action: PayloadAction<AddressType>) => {
            state.shippingData = action.payload
        }
    }
});

export const { setCustomerData, setShippingData, setSelectedOrderId } = orderSlice.actions
export default orderSlice.reducer