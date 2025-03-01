import { PriceType } from "../constants/types"

export const formatCurrency = (price: PriceType) => {
    let formatedValue = `$${price.amount.toFixed(2)} ${price.currency}`
    return formatedValue
}

