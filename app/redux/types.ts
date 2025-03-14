import { Action, EnhancedStore, StoreEnhancer, ThunkAction, ThunkDispatch, Tuple, UnknownAction } from "@reduxjs/toolkit";
import { AddressType, CartItemType, CartSummaryType, CustomerType, OrderType, ProductType } from "../constants/types";

export type RootStateType = {
    order: OrderStateType
    cart: CartStateType
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
    incompleteOrders: OrderType[],
    selectedOrderId: string | undefined,
    isFetching: boolean
    isLoadingPayment: boolean
    isUpdating: boolean
    isRefreshing: boolean
    customerData: CustomerType | null
    shippingData: AddressType | null
}

export type CartStateType = {
    items: CartItemType[]
    summary: CartSummaryType
    products: ProductType[],
    currentProduct: ProductType | undefined
    isFetching: boolean
    isRefreshing: boolean
}

export default {}