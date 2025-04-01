export type RootStackParamList = {
    Products: undefined
    Product: { productId: string };
    Cart: undefined
    Checkout: { orderId: string }
    Confirmation: { orderId: string }
}

export type ProductType = {
    category: string;
    description: string;
    id: string;
    image: string;
    unitPrice: number;
    currency: string
    rating: RatingType
    title: string
    stock: number
    purchaseLimits: PurchaseLimitType
}

export type RatingType = {
    count: number;
    rate: number;
}

export type PurchaseLimitType = {
    min: number;
    max: number;
}

export type CartItemType = {
    id: string
    cartId: string
    productId: string
    quantity: number
    unitPrice: number
    subtotal: number
    product: ProductType
}

export type UserType = {
    email: string
    name: string
}

export type AddressType = {
    address: string
    zipCode: string
}

export type OrderType = {
    id: string
    customer: CustomerType | null
    address: AddressType | null
    payment: PaymentType | null
    cart: string
    totals: TotalsType
    status: "INCOMPLETE" | "PAYMENT_PENDING" | "COMPLETE" | "CANCELLED"
    details: CartItemType[]
}

export type CustomerType = {
    id: string
    email: string
    name: string
}

export type PaymentType = {
    id: string
    amount: number
    status: string
    customer: string
    payment_method: string
    paymentDetails: PaymentMethodType
}

export type TotalsType = {
    currency: string
    items: number
    units: number
    subTotal: number
    taxes: number
    discount: number
    total: number
}

export type PaymentMethodType = {
    id: string
    card: CardType
}

export type CardType = {
    brand: string
    display_brand: string
    exp_month: number
    exp_year: number
    last4: string
    fingerprint: string
    checks: ChecksType
}

export type ChecksType = {
    cvc_check: string
}

export default {}