import { OrderType } from "../constants/types"
import { useCartContext } from "../contexts/CartContext"
import { useCheckoutContext } from "../contexts/CheckoutContext"

export const useOrder = () => {
    const { addressData, userData } = useCheckoutContext()
    const { cartSummary } = useCartContext()

    const createOrder = () => {
        const newOrder: OrderType = {
            address: addressData,
            user: userData,
            payment: { amount: cartSummary.total, currency: "MXN" },
            orderId: null
        }
        return newOrder
    }

    return { createOrder }
}