import { PriceType } from "../constants/types";

export const formatCurrency = (price: PriceType) => {
    const formatedValue = new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: price.currency,
    });

    return formatedValue.format(price.amount / 100)
}

export default {}