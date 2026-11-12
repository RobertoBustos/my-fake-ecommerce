import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import { CartItemType } from "../../constants/types";
import { createCartId, getCartId } from "../../utils/cartIdStorage";
import { auth } from "../../utils/firebase";
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
        builder.addCase(renewCartId.fulfilled, (state, action) => {
            state.items = []
            state.cartId = action.payload
        })
        builder.addCase(renewCartId.rejected, (state, action) => {
            Alert.alert(action.payload as string)
        })
    }
});

export const setCartId = createAsyncThunk("cart/setCartId", async (userId: string, { rejectWithValue }) => {
    const cartId = await getCartId(userId)
    if (!cartId) {
        return rejectWithValue("There was an error setting up cart")
    }
    return cartId
})

// A cart is ordered only once: start a new one after its order is completed or cancelled
export const renewCartId = createAsyncThunk("cart/renewCartId", async (_, { rejectWithValue }) => {
    const userId = auth.currentUser?.uid
    const cartId = userId ? await createCartId(userId) : undefined
    if (!cartId) {
        return rejectWithValue("There was an error setting up cart")
    }
    return cartId
})

export const { addItemToCart, removeItemFromCart, resetCart, clearCart, setCartFromOrder, setSelectedProductId } = cartSlice.actions
export default cartSlice.reducer