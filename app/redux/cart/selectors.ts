import { RootStateType } from "../types";

export const selectCartItems = (state: RootStateType) => state.cart.items

export const selectIsCartEmpty = (state: RootStateType) => state.cart.items.length === 0

export const selectCartSummary = (state: RootStateType) => state.cart.summary

export default {}