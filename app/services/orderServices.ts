import { CreateOrderRequestType, OrderType, RequestType, UpdateCustomerShippingDataType, UpdateOrderCustomerDataType } from "../constants/types"
import { fakeDelayPromise } from "../utils/fakeDelayPromise"
import { getFromAsyncStorage, saveToAsyncStorage } from "../utils/saveToAsyncStorage"

export async function fetchOrderService(): Promise<OrderType | Error> {
    try {
        await fakeDelayPromise(1500)
        const response = await getFromAsyncStorage("orderData")
        if (response === null) {
            throw new Error("Key not found on async storage")
        }
        return JSON.parse(response) as OrderType
    } catch (error) {
        return error as Error
    }
}

export async function createOrderService(request: CreateOrderRequestType): Promise<OrderType | Error> {
    try {
        await fakeDelayPromise(1500)
        return { orderId: Math.floor(Math.random() * 999999), customerData: null, items: request.items, shippingData: null, summary: request.summary, status: "incomplete", paymentIntent: null }
    } catch (error) {
        return error as Error
    }
}

export async function updateOrderCustomerDataService(request: RequestType<UpdateOrderCustomerDataType>): Promise<boolean | Error> {
    try {
        await fakeDelayPromise(1500)
        return true
    } catch (error) {
        return error as Error
    }
}

export async function updateOrderShippingDataService(request: RequestType<UpdateCustomerShippingDataType>): Promise<boolean | Error> {
    try {
        await fakeDelayPromise(1500)
        return true
    } catch (error) {
        return error as Error
    }
}

export async function saveOrderData(request: OrderType): Promise<boolean | Error> {
    try {
        await saveToAsyncStorage("orderData", JSON.stringify(request));
        return true
    } catch (error) {
        return error as Error
    }
}