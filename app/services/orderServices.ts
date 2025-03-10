import { CreateOrderRequestType, OrderType, RequestType, ResponseType, UpdateOrderCustomerDataType, UpdateOrderItemsType } from "../constants/types"
import { fakeDelayPromise } from "../utils/fakeDelayPromise"
import { getFromAsyncStorage, saveToAsyncStorage } from "../utils/saveToAsyncStorage"

export async function fetchIncompleteOrdersService(request: RequestType<string>): ResponseType<OrderType[]> {
    // the request is the user id
    try {
        const response = await getFromAsyncStorage("orderData")
        if (response === null) {
            return { data: [] }
        }
        return { data: JSON.parse(response) as OrderType[] }
    } catch (error) {
        return { data: [], error: error as Error }
    }
}

export async function fetchOrderService(request: RequestType<number>): ResponseType<OrderType | undefined> {
    // the request is the order id
    try {
        await fakeDelayPromise(3000)
        const response = await getFromAsyncStorage("orderData")
        if (response === null) {
            return { data: undefined }
        }
        const orders = JSON.parse(response) as OrderType[]
        const orderData = orders.find((order) => {
            return order.orderId === request
        });
        return { data: orderData }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function createOrderService(request: RequestType<CreateOrderRequestType>): ResponseType<OrderType | undefined> {
    try {
        await fakeDelayPromise(1500)
        return { data: { orderId: Math.floor(Math.random() * 999999), customerData: null, items: request.items, shippingData: null, summary: request.summary, status: "incomplete", paymentIntent: null } }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function updateOrderItemsService(request: RequestType<UpdateOrderItemsType>): ResponseType<boolean> {
    try {
        await fakeDelayPromise(1500)
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export async function updateOrderCustomerDataService(request: RequestType<UpdateOrderCustomerDataType>): ResponseType<boolean> {
    try {
        await fakeDelayPromise(1500)
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export async function updateCompleteOrderService(request: RequestType<number>): ResponseType<boolean> {
    try {
        await fakeDelayPromise(1500)
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export async function saveOrderData(request: RequestType<OrderType>): ResponseType<boolean> {
    try {
        await saveToAsyncStorage("orderData", JSON.stringify(request));
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}