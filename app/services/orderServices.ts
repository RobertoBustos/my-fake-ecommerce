import { CreateOrderRequestType, OrderType, RequestType, ResponseType, UpdateOrderCustomerDataType, UpdateOrderItemsType } from "../constants/types"
import { fakeDelayPromise } from "../utils/fakeDelayPromise"
import { getFromAsyncStorage, saveToAsyncStorage } from "../utils/saveToAsyncStorage"

export async function fetchOrderService(): ResponseType<OrderType | undefined> {
    try {
        const response = await getFromAsyncStorage("orderData")
        if (response === null) {
            return { data: undefined }
        }
        return { data: JSON.parse(response) as OrderType }
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