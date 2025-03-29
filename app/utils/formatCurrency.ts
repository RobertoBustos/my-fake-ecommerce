export const formatCurrency = (amount: number, currency: string = "MXN") => {
    if (currency) {
        const formatedValue = new Intl.NumberFormat("en-US", {
            style: 'currency',
            currency: currency,
        });
        return formatedValue.format(amount / 100)
    }
    const formatedValue = new Intl.NumberFormat("en-US")
    return formatedValue.format(amount / 100)
}

export default {}