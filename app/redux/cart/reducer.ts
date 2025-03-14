import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import { CartItemType } from "../../constants/types";
import { fetchCartService, saveCartDataService } from "../../services/cartServices";
import { getProductDetailsService, getProductsService } from "../../services/productServices";
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
    products: [],
    currentProduct: undefined,
    isFetching: false,
    isRefreshing: false
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
        },
        setRefresingState: (state, action: PayloadAction<boolean>) => {
            state.isRefreshing = action.payload
        },
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
        builder.addCase(fetchProducts.pending, (state, action) => {
            state.isFetching = true
        })
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.products = action.payload
            state.isFetching = false
            state.isRefreshing = false
        })
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.isFetching = false
            state.isRefreshing = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(fetchProductById.pending, (state, action) => {
            state.isFetching = true
        })
        builder.addCase(fetchProductById.fulfilled, (state, action) => {
            state.currentProduct = action.payload
            state.isFetching = false
            state.isRefreshing = false
        })
        builder.addCase(fetchProductById.rejected, (state, action) => {
            state.isFetching = false
            state.isRefreshing = false
            Alert.alert(action.payload as string)
        })
    }
});

export const fetchProducts = createAsyncThunk("cart/fetchProducts", async (_, { rejectWithValue }) => {
    const response = await getProductsService()
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const fetchProductById = createAsyncThunk("cart/fetchProductById", async (payload: number, { rejectWithValue }) => {
    const response = await getProductDetailsService(payload)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

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

export const { addItemToCart, updateItemFromCart, removeItemFromCart, resetCart, setCartFromOrder, setRefresingState } = cartSlice.actions
export default cartSlice.reducer