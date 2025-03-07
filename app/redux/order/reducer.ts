import { fakeDelayPromise } from "@/app/utils/fakeDelayPromise";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddressType, CartType, CreateOrderRequestType, CustomerType, UserType } from "../../constants/types";
import { createOrderService, fetchOrderService, saveOrderData, updateOrderCustomerDataService, updateOrderShippingDataService } from "../../services/orderServices";
import { fetchPaymentSheetParams, getCustomerService } from "../../services/paymentServices";
import { OrderStateType, RootStateType } from "../types";

const initialState: OrderStateType = {
    orderData: null,
    isLoading: false,
    customerData: null,
    isLoadingCustomer: false,
    shippingData: null,
    isLoadingShipping: false
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setCustomerData: (state, action: PayloadAction<UserType>) => {
            state.customerData = action.payload
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
        })
        builder.addCase(createOrder.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.orderData = action.payload
            state.isLoading = false
        })
        builder.addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(updateCustomerData.pending, (state, action) => {
            state.isLoadingCustomer = true
        })
        builder.addCase(updateCustomerData.fulfilled, (state, action) => {
            if (state.orderData !== null) {
                state.orderData.customerData = action.payload
            }
            state.customerData = null
            state.isLoadingCustomer = false
        })
        builder.addCase(updateCustomerData.rejected, (state, action) => {
            state.isLoadingCustomer = false
        })
        builder.addCase(updateShippingData.pending, (state, action) => {
            state.isLoadingShipping = true
        })
        builder.addCase(updateShippingData.fulfilled, (state, action) => {
            if (state.orderData !== null) {
                state.orderData.shippingData = action.payload
            }
            state.shippingData = null
            state.isLoadingShipping = false
        })
        builder.addCase(updateShippingData.rejected, (state, action) => {
            state.isLoadingShipping = false
        })
        builder.addCase(createPayment.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(createPayment.fulfilled, (state, action) => {
            if (state.orderData !== null) {
                state.orderData.paymentIntent = action.payload
                state.orderData.status = "payment_pending"
            }
            state.shippingData = null
            state.isLoading = false
        })
        builder.addCase(createPayment.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(updateOrderComplete.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(updateOrderComplete.fulfilled, (state, action) => {
            if (state.orderData !== null) {
                state.orderData.status = "complete"
            }
            state.isLoading = false
        })
        builder.addCase(updateOrderComplete.rejected, (state, action) => {
            state.isLoading = false
        })
    }
});

export const fetchOrder = createAsyncThunk("order/fetchOrder", async (_, { rejectWithValue }) => {
    const response = await fetchOrderService()
    if (typeof response === "object" && "message" in response) {
        return rejectWithValue(response.message)
    }
    return response
})

export const createOrder = createAsyncThunk("order/createOrder", async (payload: CreateOrderRequestType, { rejectWithValue }) => {
    if (payload.items === null || payload.summary === null) {
        return rejectWithValue("Bad Request")
    }
    const response = await createOrderService({ items: payload.items, summary: payload.summary })
    if (typeof response === "object" && "message" in response) {
        return rejectWithValue(response.message)
    }
    await saveOrderData(response)
    return response
})

export const updateCustomerData = createAsyncThunk("order/updateCustomerData", async (_, { getState, rejectWithValue, fulfillWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.customerData === null) {
        return rejectWithValue("Bad Request")
    }
    const payload = { email: order.customerData.email, userName: order.customerData.userName }
    if (order.orderData === null || order.orderData.orderId === null) {
        return fulfillWithValue(payload)
    }
    const customer = await getCustomerService({ email: order.customerData.email, userName: order.customerData.userName })
    if (typeof customer === "object" && "message" in customer) {
        return rejectWithValue(customer.message)
    }
    const result = { ...payload, customerId: customer.id }
    const response = await updateOrderCustomerDataService({ orderId: order.orderData.orderId, customerData: payload })
    if (typeof response === "object" && "message" in response) {
        return rejectWithValue(response.message)
    }
    await saveOrderData({ ...order.orderData, customerData: result })
    return result as CustomerType
})

export const updateShippingData = createAsyncThunk("order/updateShippingData", async (_, { getState, rejectWithValue, fulfillWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.shippingData === null) {
        return rejectWithValue("Bad Request")
    }
    const payload = { address: order.shippingData.address, zipCode: order.shippingData.zipCode }
    if (order.orderData === null || order.orderData.orderId === null) {
        return fulfillWithValue(payload)
    }
    const response = await updateOrderShippingDataService({ orderId: order.orderData.orderId, shippingData: payload })
    if (typeof response === "object" && "message" in response) {
        return rejectWithValue(response.message)
    }
    await saveOrderData({ ...order.orderData, shippingData: payload })
    return payload
})

export const createPayment = createAsyncThunk("order/createPayment", async (_, { getState, rejectWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.orderData === null || order.orderData.customerData === null || order.orderData.summary === null) {
        return rejectWithValue("Bad Request")
    }
    const response = await fetchPaymentSheetParams({ customerId: order.orderData.customerData.customerId, amount: order.orderData.summary.total, currency: "MXN" })
    if (typeof response === "object" && "message" in response) {
        return rejectWithValue(response.message)
    }
    await saveOrderData({ ...order.orderData, paymentIntent: response, status: "payment_pending" })
    return response
})

export const updateOrderComplete = createAsyncThunk("order/updateOrderComplete", async (_, { getState, fulfillWithValue, rejectWithValue }) => {
    const { order } = getState() as RootStateType
    if (order.orderData === null || order.orderData.customerData === null || order.orderData.summary === null) {
        return rejectWithValue("Bad Request")
    }
    await fakeDelayPromise(5000)
    await saveOrderData({ ...order.orderData, status: "complete" })
    return fulfillWithValue(true)
})

export const { setItems, setCustomerData, setShippingData, clearOrderCompleted } = orderSlice.actions
export const orderReducer = orderSlice.reducer