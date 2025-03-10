import { useCallback, useEffect, useState } from "react";
import { OrderType, PaymentMethodType } from "../constants/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchOrder, fetchOrderPayment } from "../redux/order/reducer";
import { selectIsOrderLoading } from "../redux/order/selectors";

export const useOrder = (orderId: number) => {
    const dispatch = useAppDispatch()
    const [orderData, setOrderData] = useState<OrderType>();
    const [paymentData, setPaymentData] = useState<PaymentMethodType | null>(null)
    const isLoading = useAppSelector(selectIsOrderLoading);

    const fetchOrderData = useCallback(async (orderId: number) => {
        dispatch(fetchOrder(orderId)).unwrap().then(response => {
            setOrderData(response)
            if (orderData && orderData.paymentIntent)
                dispatch(fetchOrderPayment({ orderId: orderData.orderId, paymentId: orderData.paymentIntent.paymentId })).unwrap().then((response) => {
                    setPaymentData(response)
                })
        })

    }, [dispatch, orderData])

    useEffect(() => {
        fetchOrderData(orderId)
        return () => { }
    }, [fetchOrderData, orderId]);

    return { orderData, isLoading, paymentData }
}
