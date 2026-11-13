import { useApolloClient, useLazyQuery, useMutation } from "@apollo/client/react";
import { useCallback } from "react";
import { PAYMENT_POLL_INTERVAL_MS, PAYMENT_POLL_TIMEOUT_MS } from "../constants/config";
import { AddressType, CartItemType, ConnectionType, IncompleteOrderType, MutationResponseType, OrderType, Status, UserType, dataOf, nodesOf } from "../constants/types";
import { CANCEL_ORDER, CREATE_ORDER, CREATE_ORDER_PAYMENT, UPDATE_ORDER } from "../graphql/mutations";
import { GET_INCOMPLETE_ORDERS, GET_ORDERS, GET_ORDER_PAYMENT_CUSTOMER, GET_ORDER_STATUS } from "../graphql/queries";
import { UnsuccessfulMutationError } from "../utils/apiErrors";

export type CreateOrderInput = {
    cartId: string
}

// The status is decided by the server: the order moves to PAYMENT_PENDING once it has customer and address
export type UpdateOrderInput = {
    id: string
    customer?: UserType
    address?: AddressType
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const useOrder = () => {
    const client = useApolloClient();
    const [createOrder, { loading: isCreating, }] = useMutation<{ createOrder: MutationResponseType<OrderType> }>(CREATE_ORDER);
    const [updateOrder, { loading: isUpdating, }] = useMutation<{ updateOrder: MutationResponseType<OrderType> }>(UPDATE_ORDER);
    const [cancelOrder, { loading: isCancelling, }] = useMutation<{ cancelOrder: MutationResponseType }>(CANCEL_ORDER);
    const [createOrderPayment, { loading: isCreatingPayment, }] = useMutation<{ createOrderPayment: MutationResponseType<PaymentCreated> }>(CREATE_ORDER_PAYMENT);
    const [getOrders, { loading: isLoading, data: ordersResponse, error, refetch: refetchOrder }] = useLazyQuery<{ orders: ConnectionType<OrderType> }>(GET_ORDERS, { fetchPolicy: "no-cache" });
    const [getIncompleteOrders, { data: incompleteOrdersResponse, refetch: refetchIncompleteOrders }] = useLazyQuery<{ incompleteOrders: ConnectionType<IncompleteOrderType> }>(GET_INCOMPLETE_ORDERS, { fetchPolicy: "no-cache" });

    const fetchIncompleteOrders = useCallback(async (cartId: string) => {
        return getIncompleteOrders({ variables: { cart: cartId } })
    }, [getIncompleteOrders])

    const fetchOrder = useCallback(async (id: string) => {
        return getOrders({ variables: { id } })
    }, [getOrders])

    const createNewOrder = useCallback(async (input: CreateOrderInput) => {
        try {
            const response = await createOrder({
                variables: {
                    input: input,
                },
            })
            return dataOf(response.data).createOrder.data as OrderType
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
            // updateOrder can answer success: false without a GraphQL error
            const { updateOrder: result } = dataOf(response.data)
            if (!result.success) {
                throw new UnsuccessfulMutationError(result.message)
            }
            return result.data as OrderType
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
            return dataOf(response.data).createOrderPayment.data as PaymentCreated
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
            // cancelOrder can answer success: false without a GraphQL error
            const { cancelOrder: result } = dataOf(response.data)
            if (!result.success) {
                throw new UnsuccessfulMutationError(result.message)
            }
            return result
        } catch (error) {
            throw error as Error
        }
    }, [cancelOrder])

    const fetchOrderDetails = useCallback(async (id: string): Promise<CartItemType[]> => {
        const response = await client.query<{ orders: ConnectionType<OrderType> }>({ query: GET_ORDERS, variables: { id }, fetchPolicy: "no-cache" })
        return nodesOf(dataOf(response.data).orders)[0]?.details ?? []
    }, [client])

    const fetchPaymentCustomer = useCallback(async (id: string): Promise<string | undefined> => {
        const response = await client.query<{ orders: ConnectionType<Pick<OrderType, "id" | "payment">> }>({ query: GET_ORDER_PAYMENT_CUSTOMER, variables: { id }, fetchPolicy: "no-cache" })
        return nodesOf(dataOf(response.data).orders)[0]?.payment?.customer
    }, [client])

    // The Stripe webhook completes the order, there are no subscriptions so the status is polled.
    // Returns the last known status, still PAYMENT_PENDING when the time is up
    const waitForOrderCompletion = useCallback(async (id: string): Promise<Status | undefined> => {
        const deadline = Date.now() + PAYMENT_POLL_TIMEOUT_MS
        let status: Status | undefined
        while (Date.now() < deadline) {
            try {
                const response = await client.query<{ orders: ConnectionType<Pick<OrderType, "id" | "status">> }>({ query: GET_ORDER_STATUS, variables: { id }, fetchPolicy: "no-cache" })
                status = nodesOf(dataOf(response.data).orders)[0]?.status
                if (status === Status.COMPLETE || status === Status.CANCELLED) return status
            } catch {
                // A failed check does not stop the wait, the next one may succeed
            }
            await delay(PAYMENT_POLL_INTERVAL_MS)
        }
        return status
    }, [client])

    const incompleteOrders: IncompleteOrderType[] = nodesOf(incompleteOrdersResponse?.incompleteOrders)
    const orders: OrderType[] = nodesOf(ordersResponse?.orders)

    return { fetchIncompleteOrders, incompleteOrders, refetchIncompleteOrders, fetchOrder, orders, isLoading, error, refetchOrder, createNewOrder, isCreating, updateExistingOrder, isUpdating, createPayment, isCreatingPayment, cancelExistingOrder, isCancelling, fetchOrderDetails, fetchPaymentCustomer, waitForOrderCompletion }
}

export default useOrder
