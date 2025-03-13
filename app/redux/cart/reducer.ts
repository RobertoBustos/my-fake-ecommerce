import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import { CartItemType } from "../../constants/types";
import { fetchCartService, saveCartDataService } from "../../services/cartServices";
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
    summary: initialSummary
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, action: PayloadAction<CartItemType>) => {
            const item = state.items.find(item => item.id === action.payload.id)
            if (item) {
                item.quantity = item.quantity + action.payload.quantity
                item.subtotal = item.subtotal + action.payload.subtotal
            } else {
                state.items = [...state.items, action.payload]
            }
            state.summary = createCartSummary(state.items)
            saveCartDataService(state.items)
        },
        updateItemFromCart: (state, action: PayloadAction<{ productId: number, quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.productId)
            if (item) {
                item.quantity = action.payload.quantity
            }
            state.summary = createCartSummary(state.items)
            saveCartDataService(state.items)
        },
        removeItemFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload)
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
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state, action) => {

        })
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.items = action.payload
            state.summary = createCartSummary(action.payload)
        })
        builder.addCase(fetchCart.rejected, (state, action) => {
            Alert.alert(action.payload as string)
        })
    }
});

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    const response = await fetchCartService()
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error fetching cart information")
    }
    return response.data
})

export const { addItemToCart, updateItemFromCart, removeItemFromCart, resetCart, setCartFromOrder } = cartSlice.actions
export default cartSlice.reducer