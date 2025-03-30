import { RootStateType } from "../types";

export const selectCartItems = (state: RootStateType) => state.cart.items

export const selectIsCartEmpty = (state: RootStateType) => state.cart.items.length === 0

export const selectCartId = (state: RootStateType) => state.cart.cartId

export const selectSelectedProductId = (state: RootStateType) => state.cart.selectedProductId

export default {}