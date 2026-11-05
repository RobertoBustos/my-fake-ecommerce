import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import { CartItemType } from "../../constants/types";
import { getDeviceId } from "../../utils/getDeviceId";
import { CartStateType } from "../types";

const initialState: CartStateType = {
    items: [],
    cartId: "",
    selectedProductId: ""
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setSelectedProductId: (state, action: PayloadAction<string>) => {
            state.selectedProductId = action.payload
        },
        addItemToCart: (state, action: PayloadAction<CartItemType>) => {
            const item = state.items.find(item => item.id === action.payload.id)
            if (item) {
                item.quantity = action.payload.quantity
                item.subtotal = action.payload.subtotal
            } else {
                state.items = [...state.items, action.payload]
            }
        },
        removeItemFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        },
        resetCart: (state) => {
            state.items = []
        },
        clearCart: (state) => {
            state.items = []
            state.cartId = ""
            state.selectedProductId = ""
        },
        setCartFromOrder: (state, action: PayloadAction<CartItemType[]>) => {
            state.items = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setCartId.fulfilled, (state, action) => {
            state.cartId = action.payload
        })
        builder.addCase(setCartId.rejected, (state, action) => {
            Alert.alert(action.payload as string)
        })
    }
});

export const setCartId = createAsyncThunk("cart/setCartId", async (_, { rejectWithValue }) => {
    const cartId = await getDeviceId()
    if (!cartId) {
        return rejectWithValue("There was an error setting up cart")
    }
    return cartId
})

export const { addItemToCart, removeItemFromCart, resetCart, clearCart, setCartFromOrder, setSelectedProductId } = cartSlice.actions
export default cartSlice.reducer