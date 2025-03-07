import { Action, EnhancedStore, StoreEnhancer, ThunkAction, ThunkDispatch, Tuple, UnknownAction } from "@reduxjs/toolkit";
import { AddressType, OrderType, UserType } from "../constants/types";

export type RootStateType = {
    order: OrderStateType
}

export type AppStore = EnhancedStore<RootStateType, UnknownAction, Tuple<[StoreEnhancer<{
    dispatch: ThunkDispatch<RootStateType, undefined, UnknownAction>;
}>, StoreEnhancer]>>;
export type RootState = ReturnType<AppStore["getState"]>;
export type PreloadState = Partial<RootState>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;

export type OrderStateType = {
    orderData: OrderType | null
    isLoading: boolean
    customerData: UserType | null
    isLoadingCustomer: boolean
    shippingData: AddressType | null
    isLoadingShipping: boolean
}