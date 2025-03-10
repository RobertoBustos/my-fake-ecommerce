import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initPaymentSheet } from "@stripe/stripe-react-native";
import { Alert } from "react-native";
import { AddressType, CartType, OrderType, UserType } from "../../constants/types";
import { createOrderService, fetchOrderService, saveOrderData, updateCompleteOrderService, updateOrderCustomerDataService, updateOrderItemsService } from "../../services/orderServices";
import { createPaymentService, preparePaymentSheetService, searchPaymentService, updatePaymentAmountService, updatePaymentService } from "../../services/paymentServices";
import { OrderStateType, RootStateType } from "../types";

const initialState: OrderStateType = {
    orderData: null,
    isLoading: false,
    customerData: null,
    shippingData: null,
    paymentData: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setCustomerData: (state, action: PayloadAction<UserType>) => {
            state.customerData = { ...action.payload, customerId: "" }
        },
        setShippingData: (state, action: PayloadAction<AddressType>) => {
            state.shippingData = action.payload
        },
        setItems: (state, action: PayloadAction<CartType>) => {
            if (state.orderData !== null) {
                state.orderData.items = action.payload
            }
        },
        clearOrderCompleted: (state) => {
            if (state.orderData !== null && state.orderData.status === "complete") {
                state.orderData = null
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrder.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchOrder.fulfilled, (state, action) => {
            state.orderData = action.payload
            state.customerData = action.payload.customerData
            state.shippingData = action.payload.shippingData
            state.isLoading = false
        })
        builder.addCase(fetchOrder.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(createOrder.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.orderData = action.payload
            state.isLoading = false
            saveOrderData(action.payload)

        })
        builder.addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(updateOrderItems.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(updateOrderItems.fulfilled, (state, action) => {
            state.isLoading = false
            if (typeof action.payload !== "boolean") {
                state.orderData = action.payload
                saveOrderData(action.payload)
            }
        })
        builder.addCase(updateOrderItems.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(updateCustomerData.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(updateCustomerData.fulfilled, (state, action) => {
            state.orderData = action.payload
            state.customerData = null
            state.shippingData = null
            state.isLoading = false
            saveOrderData(action.payload)
        })
        builder.addCase(updateCustomerData.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(preparePaymentSheet.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(preparePaymentSheet.fulfilled, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(preparePaymentSheet.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(updateOrderComplete.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(updateOrderComplete.fulfilled, (state, action) => {
            state.orderData = action.payload
            state.isLoading = false
            saveOrderData(action.payload)
        })
        builder.addCase(updateOrderComplete.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(fetchOrderPayment.pending, (state, action) => {
            state.paymentData = null
            state.isLoading = true
        })
        builder.addCase(fetchOrderPayment.fulfilled, (state, action) => {
            state.paymentData = action.payload
            state.isLoading = false
        })
        builder.addCase(fetchOrderPayment.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
    }
});

export const fetchOrder = createAsyncThunk("order/fetchOrder", async (_, { rejectWithValue }) => {
    const response = await fetchOrderService()
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error fetching orders")
    }
    return response.data
})

export const createOrder = createAsyncThunk("order/createOrder", async (_, { getState, rejectWithValue }) => {
    const { cart } = getState() as RootStateType
    if (cart.items.length === 0) {
        return rejectWithValue("Request Failed")
    }
    const response = await createOrderService({ items: cart.items, summary: cart.summary })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting data from order")
    }
    const paymentResponse = await createPaymentService(response.data)
    if (paymentResponse.error) {
        return rejectWithValue(paymentResponse.error.message)
    }
    if (!paymentResponse.data) {
        return rejectWithValue("Error getting data from payment")
    }
    return { ...response.data, paymentIntent: paymentResponse.data }
})

export const updateOrderItems = createAsyncThunk("order/updateOrderItems", async (_, { getState, rejectWithValue, fulfillWithValue }) => {
    const { cart, order } = getState() as RootStateType
    if (order.orderData === null || order.orderData.summary === null || order.orderData.paymentIntent === null) {
        return rejectWithValue("Request Failed")
    }
    if (order.orderData.summary.total === cart.summary.total) {
        return fulfillWithValue(true)
    }
    const payload = { items: cart.items, summary: cart.summary, orderId: order.orderData.orderId, paymentId: order.orderData.paymentIntent.paymentId }
    const response = await updateOrderItemsService(payload)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    const paymentResponse = await updatePaymentAmountService(payload)
    if (paymentResponse.error) {
        return rejectWithValue(paymentResponse.error.message)
    }
    if (!paymentResponse.data) {
        return rejectWithValue("There was an error updating the order")
    }
    return { ...order.orderData, items: cart.items, summary: cart.summary } as OrderType
})

export const updateCustomerData = createAsyncThunk("order/updateCustomerData", async (_, { getState, rejectWithValue, fulfillWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.orderData === null || order.customerData === null || order.shippingData === null || order.orderData.paymentIntent === null) {
        return rejectWithValue("Request Failed")
    }
    const payload = { orderId: order.orderData.orderId, customerData: order.customerData, shippingData: order.shippingData, paymentId: order.orderData.paymentIntent.paymentId }
    const response = await updateOrderCustomerDataService(payload)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    const paymentResponse = await updatePaymentService(payload)
    if (paymentResponse.error) {
        return rejectWithValue(paymentResponse.error.message)
    }
    if (!paymentResponse.data) {
        return rejectWithValue("There was an error updating the order")
    }
    if (paymentResponse.data) {
        order.customerData.customerId = paymentResponse.data.customer
    }
    return { ...order.orderData, shippingData: payload.shippingData, customerData: order.customerData, status: "payment_pending" } as OrderType
})

export const preparePaymentSheet = createAsyncThunk("order/preparePaymentSheet", async (_, { getState, rejectWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.orderData === null || order.orderData.customerData === null || order.orderData.paymentIntent === null) {
        return rejectWithValue("Request Failed")
    }
    const response = await preparePaymentSheetService({ customerId: order.orderData.customerData.customerId, paymentId: order.orderData.paymentIntent.paymentId })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("There was an error preparing the payment")
    }
    const { clientSecret, ephemeralKey } = response.data
    const paymentSheetResponse = await initPaymentSheet({
        customerId: order.orderData.customerData.customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "My Fake Ecommerce",
        allowsDelayedPaymentMethods: true,
        returnURL: "stripe-example://stripe-redirect",
        defaultBillingDetails: {
            name: order.orderData.customerData.userName,
            email: order.orderData.customerData.email,
        },
    });
    if (paymentSheetResponse.error) {
        return rejectWithValue(paymentSheetResponse.error.message)
    }
    return true
})

export const updateOrderComplete = createAsyncThunk("order/updateOrderComplete", async (_, { getState, rejectWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.orderData === null || order.orderData.customerData === null || order.orderData.summary === null) {
        return rejectWithValue("Request Failed")
    }
    const response = await updateCompleteOrderService(order.orderData.orderId)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    return { ...order.orderData, status: "complete" } as OrderType
})

export const fetchOrderPayment = createAsyncThunk("order/searchPayment", async (_, { getState, rejectWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.orderData === null || order.orderData.paymentIntent === null) {
        return rejectWithValue("Request Failed")
    }
    const response = await searchPaymentService({ paymentId: order.orderData.paymentIntent.paymentId, orderId: order.orderData.orderId })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error fetching orders")
    }
    return response.data
})

export const { setItems, setCustomerData, setShippingData, clearOrderCompleted } = orderSlice.actions
export default orderSlice.reducer