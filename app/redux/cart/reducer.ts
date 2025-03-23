import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartItemType } from "../../constants/types";
import { saveCartDataService } from "../../services/cartServices";
import { createCartSummary } from "../../utils/createCartSummary";
import { CartStateType } from "../types";

const initialSummary = {
    details: [],
    subtotal: 0,
    taxes: 0,
    total: 0,
    discount: 0
}
const initialState: CartStateType = {
    items: [],
    summary: initialSummary,
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, action: PayloadAction<CartItemType>) => {
            const item = state.items.find(item => item.productId === action.payload.productId)
            if (item) {
                item.quantity = item.quantity + action.payload.quantity
                item.subtotal = item.subtotal + action.payload.subtotal
            } else {
                state.items = [...state.items, action.payload]
            }
            state.summary = createCartSummary(state.items)
            saveCartDataService(state.items)
        },
        removeItemFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.cartItemId !== action.payload)
            state.summary = createCartSummary(state.items)
            saveCartDataService(state.items)
        },
        resetCart: (state) => {
            state.items = []
            state.summary = initialSummary
            saveCartDataService(state.items)
        },
        setCartFromOrder: (state, action: PayloadAction<CartItemType[]>) => {
            state.items = action.payload
            state.summary = createCartSummary(action.payload)
            saveCartDataService(state.items)
        }
    },
});

export const { addItemToCart, removeItemFromCart, resetCart, setCartFromOrder } = cartSlice.actions
export default cartSlice.reducer