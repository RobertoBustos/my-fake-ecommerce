import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AddressType, UserType } from "../../constants/types";
import { OrderStateType } from "../types";

const initialState: OrderStateType = {
    selectedOrderId: undefined,
    customerData: null,
    addressData: null,
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
        setAddressData: (state, action: PayloadAction<AddressType>) => {
            state.addressData = action.payload
        }
    }
});

export const { setCustomerData, setAddressData, setSelectedOrderId } = orderSlice.actions
export default orderSlice.reducer