import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { AddressType, IncompleteOrderType, OrderType, UserType } from "../constants/types";
import { CANCEL_ORDER, CREATE_ORDER, CREATE_ORDER_PAYMENT, UPDATE_ORDER } from "../graphql/mutations";
import { GET_INCOMPLETE_ORDERS, GET_ORDERS } from "../graphql/queries";

export type CreateOrderInput = {
    cartId: string
}

export type UpdateOrderInput = {
    id: string
    customer: UserType | null
    address: AddressType | null
    status: string | null
}

export type CreateOrderPaymentInput = {
    orderId: string
}

export type CancelOrderInput = {
    id: string
}

export type PaymentCreated = {
    paymentId: string
    clientSecret: string
    ephimeralKey: string
}


const useOrder = () => {
    const [createOrder, { loading: isCreating, }] = useMutation(CREATE_ORDER);
    const [updateOrder, { loading: isUpdating, }] = useMutation(UPDATE_ORDER);
    const [cancelOrder, { loading: isCancelling, }] = useMutation(CANCEL_ORDER);
    const [createOrderPayment, { loading: isCreatingPayment, }] = useMutation(CREATE_ORDER_PAYMENT);
    const [getOrders, { loading: isLoading, data: ordersResponse, error, refetch: refetchOrder }] = useLazyQuery(GET_ORDERS);
    const [getIncompleteOrders, { data: incompleteOrdersResponse, refetch: refetchIncompleteOrders }] = useLazyQuery(GET_INCOMPLETE_ORDERS, { fetchPolicy: "no-cache" });

    const fetchIncompleteOrders = useCallback(async (cartId: string) => {
        return getIncompleteOrders({ variables: { filter: { field: "cart", value: cartId } } })
    }, [getIncompleteOrders])

    const fetchOrder = useCallback(async (id: string, pollInterval: number = 0) => {
        return getOrders({ variables: { filter: { field: "id", value: id } }, pollInterval })
    }, [getOrders])

    const createNewOrder = useCallback(async (input: CreateOrderInput) => {
        try {
            const response = await createOrder({
                variables: {
                    input: input,
                },
            })
            return response.data.createOrder.data
        } catch (error) {
            throw error as Error
        }
    }, [createOrder])

    const updateExistingOrder = useCallback(async (input: UpdateOrderInput) => {
        try {
            const response = await updateOrder({
                variables: {
                    input: input,
                },
            })
            return response.data.updateOrder
        } catch (error) {
            throw error as Error
        }
    }, [updateOrder])

    const createPayment = useCallback(async (input: CreateOrderPaymentInput) => {
        try {
            const response = await createOrderPayment({
                variables: {
                    input: input,
                },
            })
            return response.data.createOrderPayment.data
        } catch (error) {
            throw error as Error
        }
    }, [createOrderPayment])

    const cancelExistingOrder = useCallback(async (input: CancelOrderInput) => {
        try {
            const response = await cancelOrder({
                variables: {
                    input: input,
                },
            })
            return response.data.cancelOrder.data
        } catch (error) {
            throw error as Error
        }
    }, [cancelOrder])

    const incompleteOrders: IncompleteOrderType[] = incompleteOrdersResponse ? incompleteOrdersResponse.incompleteOrders : []
    const orders: OrderType[] = ordersResponse ? ordersResponse.orders : []

    return { fetchIncompleteOrders, incompleteOrders, refetchIncompleteOrders, fetchOrder, orders, isLoading, error, refetchOrder, createNewOrder, isCreating, updateExistingOrder, isUpdating, createPayment, isCreatingPayment, cancelExistingOrder, isCancelling }
}

export default useOrder