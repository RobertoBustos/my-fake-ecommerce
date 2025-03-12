import { CartItemType, CartSummaryType } from "../constants/types";

export const createCartSummary = (cartItems: CartItemType[]): CartSummaryType => {
    const details = cartItems.map(item => {
        return {
            unitPrice: item.price.amount,
            quantity: item.quantity,
            subtotal: item.price.amount * item.quantity
        }
    })
    const summary = {
        details,
        discount: 0,
        subtotal: cartItems.reduce((total, item) => total + item.subtotal, 0),
        taxes: cartItems.reduce((total, item) => total + Math.floor(item.subtotal * 0.16), 0)
    }
    return { ...summary, total: summary.subtotal + summary.taxes }
}

export default {}