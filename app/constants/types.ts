export type RootStackParamList = {
    Products: undefined
    Product: { productId: string };
    Cart: undefined
    Checkout: undefined
    Confirmation: undefined
}

export type ProductType = {
    category: string;
    description: string;
    id: number;
    image: string;
    unitPrice: number;
    currency: string
    rating: RatingType
    title: string
    stock: number
    purchaseLimit?: PurchaseLimitType
}

export type PriceType = {
    amount: number;
    currency?: string;
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
    cartItemId: string
    productId: string
    quantity: number
    unitPrice: number
    image: string
    title: string
    subtotal: number
}

export type CartSummaryType = {
    details: CartSummaryItemType[]
    subtotal: number
    taxes: number
    total: number
    discount: number
}

export type CartSummaryItemType = {
    quantity: number
    unitPrice: number
    taxes?: number
    discount?: number
    subtotal: number
}

export type UserType = {
    email: string
    userName: string
}

export type AddressType = {
    address: string
    zipCode: string
}

export type OrderType = {
    orderId: string
    customerData: CustomerType | null
    shippingData: ShippingType | null
    paymentIntent: PaymentType | null
    items: CartItemType[] | null
    summary: CartSummaryType | null
    status: "incomplete" | "payment_pending" | "complete" | "cancelled"
}

export type CustomerType = UserType & { customerId: string }

export type ShippingType = AddressType

export type PaymentType = {
    paymentId: string
    customer: string
    amount: number
}

export type PaymentMethodType = {
    id: string
    type: string
    card?: CardType
}

export type CardType = {
    brand: string
    display_brand: string
    exp_month: number
    exp_year: number
    last4: string
    fingerprint: string
}

export default {}