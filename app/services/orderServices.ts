import { OrderType } from "../constants/types"
import { createCartSummary } from "../utils/createCartSummary"
import { fakeDelayPromise } from "../utils/fakeDelayPromise"
import { getFromAsyncStorage, saveToAsyncStorage } from "../utils/saveToAsyncStorage"
import { cancelPaymentService, updatePaymentCustomerService } from "./paymentServices"
import { CancelOrder, ChangeOrderToComplete, ChangeOrderToIncomplete, CreateOrder, FetchIncompleteOrders, FetchOrder, RequestType, ResponseType, UpdateOrderCustomer, UpdateOrderItems } from "./serviceTypes"

export const searchOrderInAsyncStorage = async (orderId: string): Promise<OrderType | undefined> => {
    const response = await getFromAsyncStorage("orderData")
    if (response === null) {
        return undefined
    }
    const orders = JSON.parse(response) as OrderType[]
    const orderData = orders.find((order) => {
        return order.orderId === orderId
    })
    return orderData
}

export async function fetchIncompleteOrdersService(request: RequestType<FetchIncompleteOrders>): ResponseType<OrderType[]> {
    try {
        await fakeDelayPromise(1500)
        const response = await getFromAsyncStorage("orderData")
        if (response === null) {
            return { data: [] }
        }
        return { data: JSON.parse(response) as OrderType[] }
    } catch (error) {
        return { data: [], error: error as Error }
    }
}

export async function fetchOrderService(request: RequestType<FetchOrder>): ResponseType<OrderType | undefined> {
    try {
        await fakeDelayPromise(1500)
        const orderData = await searchOrderInAsyncStorage(request.orderId)
        return { data: orderData }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function createOrderService(request: RequestType<CreateOrder>): ResponseType<OrderType | undefined> {
    try {
        if (request.items.length === 0) {
            throw new Error("Cant register an order without items")
        }
        await fakeDelayPromise(1500)
        return { data: { orderId: Math.floor(Math.random() * 999999).toString(), customerData: null, items: request.items, shippingData: null, summary: createCartSummary(request.items), status: "incomplete", paymentIntent: null } }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function updateOrderItemsService(request: RequestType<UpdateOrderItems>): ResponseType<OrderType | undefined> {
    try {
        await fakeDelayPromise(1500)
        const orderData = await searchOrderInAsyncStorage(request.orderId)
        if (!orderData) {
            throw new Error("Order Not Found")
        }
        const newSummary = createCartSummary(request.items)
        const newOrder = { ...orderData, items: request.items, summary: createCartSummary(request.items) }
        if (orderData.summary?.total !== newSummary.total) {
            throw new Error("The order amount needs to be updated")
        }
        return { data: newOrder }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function updateOrderCustomerDataService(request: RequestType<UpdateOrderCustomer>): ResponseType<OrderType | undefined> {
    try {
        await fakeDelayPromise(1500)
        const orderData = await searchOrderInAsyncStorage(request.orderId)
        if (!orderData) {
            throw new Error("Order Not Found")
        }
        if (orderData.paymentIntent === null) {
            throw new Error("Payment Not Found")
        }
        const paymentResponse = await updatePaymentCustomerService({ orderId: request.orderId, customerData: request.customerData, shippingData: request.shippingData, paymentId: orderData.paymentIntent.paymentId })
        if (paymentResponse.error) {
            throw new Error(paymentResponse.error.message)
        }
        if (!paymentResponse.data) {
            throw new Error("Customer Not Found")
        }
        const newOrder = { ...orderData, customerData: { ...request.customerData, customerId: paymentResponse.data.customer }, shippingData: request.shippingData }
        return { data: newOrder }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function updateCompleteOrderService(request: RequestType<ChangeOrderToComplete>): ResponseType<OrderType | undefined> {
    try {
        await fakeDelayPromise(1500)
        const orderData = await searchOrderInAsyncStorage(request.orderId)
        if (!orderData) {
            throw new Error("Order Not Found")
        }
        const newOrder = { ...orderData, status: "complete" }
        return { data: newOrder as OrderType }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function changeOrderToIncompleteService(request: RequestType<ChangeOrderToIncomplete>): ResponseType<string | undefined> {
    try {
        const orderData = await searchOrderInAsyncStorage(request)
        if (!orderData) {
            throw new Error("Order Not Found")
        }
        return { data: request }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function cancelOrderService(request: RequestType<CancelOrder>): ResponseType<string | undefined> {
    try {
        const orderData = await searchOrderInAsyncStorage(request)
        if (!orderData) {
            throw new Error("Order Not Found")
        }
        if (orderData.paymentIntent === null) {
            throw new Error("Payment Not Found")
        }
        await fakeDelayPromise(1500)
        const paymentResponse = await cancelPaymentService({ paymentId: orderData.paymentIntent.paymentId })
        if (paymentResponse.error) {
            throw new Error(paymentResponse.error.message)
        }
        return { data: request }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function saveOrderData(request: RequestType<OrderType[]>): ResponseType<boolean> {
    try {
        await saveToAsyncStorage("orderData", JSON.stringify(request));
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export default {}