import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import { AddressType, UserType } from "../../constants/types";
import { cancelOrderService, changeOrderToIncompleteService, createOrderService, fetchIncompleteOrdersService, fetchOrderService, saveOrderData, updateCompleteOrderService, updateOrderCustomerDataService, updateOrderItemsService } from "../../services/orderServices";
import { createPaymentService, preparePaymentSheetService, searchPaymentService } from "../../services/paymentServices";
import { OrderStateType, RootStateType } from "../types";

const initialState: OrderStateType = {
    incompleteOrders: [],
    selectedOrderId: undefined,
    isLoading: false,
    isLoadingPayment: false,
    isUpdating: false,
    customerData: null,
    shippingData: null,
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setSelectedOrderId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedOrderId = action.payload
        },
        setCustomerData: (state, action: PayloadAction<UserType>) => {
            state.customerData = { ...action.payload, customerId: "" }
        },
        setShippingData: (state, action: PayloadAction<AddressType>) => {
            state.shippingData = action.payload
        },
        setCompleteStatus: (state, action: PayloadAction<string>) => {
            const order = state.incompleteOrders.find(order => order.orderId === action.payload)
            if (order) {
                order.status = "complete"
                saveOrderData(state.incompleteOrders)
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchIncompleteOrders.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchIncompleteOrders.fulfilled, (state, action) => {
            state.incompleteOrders = action.payload
            state.isLoading = false
        })
        builder.addCase(fetchIncompleteOrders.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(fetchOrder.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(fetchOrder.fulfilled, (state, action) => {
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
            state.incompleteOrders = [...state.incompleteOrders, action.payload]
            state.isLoading = false
            saveOrderData(state.incompleteOrders)
        })
        builder.addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(updateOrderItems.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(updateOrderItems.fulfilled, (state, action) => {
            const order = state.incompleteOrders.find(order => order.orderId === action.payload.orderId)
            if (order) {
                order.items = action.payload.items
                order.summary = action.payload.summary
                order.status = "incomplete"
                saveOrderData(state.incompleteOrders)
            }
            state.isLoading = false
        })
        builder.addCase(updateOrderItems.rejected, (state, action) => {
            state.isLoading = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(updateCustomerData.pending, (state, action) => {
            state.isUpdating = true
        })
        builder.addCase(updateCustomerData.fulfilled, (state, action) => {
            const order = state.incompleteOrders.find(order => order.orderId === action.payload.orderId)
            if (order) {
                order.customerData = action.payload.customerData
                order.shippingData = action.payload.shippingData
                order.status = "payment_pending"
                saveOrderData(state.incompleteOrders)
            }
            state.isUpdating = false
        })
        builder.addCase(updateCustomerData.rejected, (state, action) => {
            state.isUpdating = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(preparePaymentSheet.pending, (state, action) => {
            state.isUpdating = true
        })
        builder.addCase(preparePaymentSheet.fulfilled, (state, action) => {
            state.isUpdating = false
        })
        builder.addCase(preparePaymentSheet.rejected, (state, action) => {
            state.isUpdating = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(updateOrderComplete.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(updateOrderComplete.fulfilled, (state, action) => {
            const order = state.incompleteOrders.find(order => order.orderId === action.payload.orderId)
            if (order) {
                order.status = action.payload.status
                saveOrderData(state.incompleteOrders)
            }
            state.isLoading = false
        })
        builder.addCase(updateOrderComplete.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(fetchOrderPayment.pending, (state, action) => {
            state.isLoadingPayment = true
        })
        builder.addCase(fetchOrderPayment.fulfilled, (state, action) => {
            state.isLoadingPayment = false
        })
        builder.addCase(fetchOrderPayment.rejected, (state, action) => {
            state.isLoadingPayment = false
        })
        builder.addCase(changeOrdertoIncomplete.pending, (state, action) => {
            state.isUpdating = true
        })
        builder.addCase(changeOrdertoIncomplete.fulfilled, (state, action) => {
            const order = state.incompleteOrders.find(order => order.orderId === action.payload)
            if (order) {
                order.status = "incomplete"
                saveOrderData(state.incompleteOrders)
            }
            state.isUpdating = false
        })
        builder.addCase(changeOrdertoIncomplete.rejected, (state, action) => {
            state.isUpdating = false
            Alert.alert(action.payload as string)
        })
        builder.addCase(cancelOrder.pending, (state, action) => {
            state.isUpdating = true
        })
        builder.addCase(cancelOrder.fulfilled, (state, action) => {
            const order = state.incompleteOrders.find(order => order.orderId === action.payload)
            if (order) {
                order.status = "cancelled"
                saveOrderData(state.incompleteOrders)
            }
            state.isUpdating = false
        })
        builder.addCase(cancelOrder.rejected, (state, action) => {
            state.isUpdating = false
            Alert.alert(action.payload as string)
        })
    }
});

export const fetchIncompleteOrders = createAsyncThunk("order/fetchIncompleteOrders", async (payload: string, { rejectWithValue }) => {
    const response = await fetchIncompleteOrdersService({ userId: payload })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const fetchOrder = createAsyncThunk("order/fetchOrder", async (payload: string, { rejectWithValue }) => {
    const response = await fetchOrderService({ orderId: payload })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const createOrder = createAsyncThunk("order/createOrder", async (_, { getState, rejectWithValue }) => {
    const { cart, order } = getState() as RootStateType
    // TODO: this validation should be in the service
    if (order.incompleteOrders.length >= 3) {
        return rejectWithValue("Please complete one of your orders to continue")
    }
    const response = await createOrderService({ items: cart.items })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    const totalAmount = response.data.summary?.total || cart.summary.total
    const paymentResponse = await createPaymentService({ orderId: response.data.orderId, amount: totalAmount })
    if (paymentResponse.error) {
        return rejectWithValue(paymentResponse.error.message)
    }
    if (!paymentResponse.data) {
        return rejectWithValue("Error getting service response")
    }
    return { ...response.data, paymentIntent: paymentResponse.data }
})

export const updateOrderItems = createAsyncThunk("order/updateOrderItems", async (payload: string, { getState, rejectWithValue, fulfillWithValue }) => {
    const { cart } = getState() as RootStateType
    const servicePayload = { items: cart.items, orderId: payload }
    const response = await updateOrderItemsService(servicePayload)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const updateCustomerData = createAsyncThunk("order/updateCustomerData", async (payload: string, { getState, rejectWithValue, fulfillWithValue }) => {
    const { order } = getState() as RootStateType
    // TODO: this validation should be in the service
    if (order.customerData === null || order.shippingData === null) {
        return rejectWithValue("Customer data not found")
    }
    const payloadService = { orderId: payload, customerData: order.customerData, shippingData: order.shippingData }
    const response = await updateOrderCustomerDataService(payloadService)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const preparePaymentSheet = createAsyncThunk("order/preparePaymentSheet", async (payload: string, { rejectWithValue }) => {
    const response = await preparePaymentSheetService({ orderId: payload })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("There was an error preparing the payment")
    }
    return response.data
})

export const updateOrderComplete = createAsyncThunk("order/updateOrderComplete", async (payload: string, { rejectWithValue }) => {
    const response = await updateCompleteOrderService({ orderId: payload })
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const fetchOrderPayment = createAsyncThunk("order/searchPayment", async (payload: { orderId: string, paymentId: string }, { rejectWithValue }) => {
    const response = await searchPaymentService(payload)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error fetching orders")
    }
    return response.data
})

export const changeOrdertoIncomplete = createAsyncThunk("order/changeOrdertoIncomplete", async (payload: string, { rejectWithValue }) => {
    const response = await changeOrderToIncompleteService(payload)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const cancelOrder = createAsyncThunk("order/cancelOrder", async (payload: string, { rejectWithValue }) => {
    const response = await cancelOrderService(payload)
    if (response.error) {
        return rejectWithValue(response.error.message)
    }
    if (!response.data) {
        return rejectWithValue("Error getting service response")
    }
    return response.data
})

export const { setCustomerData, setShippingData, setSelectedOrderId, setCompleteStatus } = orderSlice.actions
export default orderSlice.reducer