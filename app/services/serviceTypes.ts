import { AddressType, CartItemType, CustomerType, ShippingType, UserType } from "../constants/types"

export type RequestType<T> = T

export type ResponseType<T> = Promise<{
    data: T
    error?: Error
}>

export type SearchPayment = {
    paymentId: string,
    orderId: string
}

export type CreatePayment = {
    orderId: string
    amount: number
}

export type UpdatePaymentCustomer = {
    orderId: string
    customerData: UserType
    shippingData: AddressType
    paymentId: string
}

export type UpdatePaymentAmount = {
    paymentId: string
    amount: number
}

export type PreparePaymentSheet = {
    orderId: string
}

export type CancelPayment = {
    paymentId: string
}

export type FetchIncompleteOrders = {
    userId: string
}

export type FetchOrder = {
    orderId: string
}

export type CreateOrder = {
    items: CartItemType[]
}

export type UpdateOrderItems = {
    orderId: string
    items: CartItemType[]
}

export type UpdateOrderCustomer = {
    orderId: string
    customerData: CustomerType
    shippingData: ShippingType
}

export type ChangeOrderToComplete = {
    orderId: string
}

export type ChangeOrderToIncomplete = string

export type CancelOrder = string
