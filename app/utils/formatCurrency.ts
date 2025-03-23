import { PriceType } from "../constants/types";

export const formatCurrency = (price: PriceType) => {
    if (price.currency) {
        const formatedValue = new Intl.NumberFormat("en-US", {
            style: 'currency',
            currency: price.currency,
        });
        return formatedValue.format(price.amount / 100)
    }
    const formatedValue = new Intl.NumberFormat("en-US")
    return formatedValue.format(price.amount / 100)
}

export default {}