import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LatLng } from "react-native-maps";
import { AddressType, UserType } from "../../constants/types";
import { OrderStateType } from "../types";

const initialState: OrderStateType = {
    selectedOrderId: undefined,
    customerData: null,
    addressData: null,
    mapCenter: null,
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
        },
        setMapCenter: (state, action: PayloadAction<LatLng | null>) => {
            state.mapCenter = action.payload
        },
        resetOrder: () => initialState,
    }
});

export const { setCustomerData, setAddressData, setSelectedOrderId, setMapCenter, resetOrder } = orderSlice.actions
export default orderSlice.reducer