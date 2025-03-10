export type RootStackParamList = {
    Products: undefined;
    Product: { productId: number };
    Cart: undefined;
    Checkout: undefined;
    Confirmation: undefined
}

export type RequestType<T> = T

export type ResponseType<T> = Promise<{
    data: T
    error?: Error
}>

export type ProductType = {
    category: string;
    description: string;
    id: number;
    image: string;
    price: PriceType;
    rating: {
        count: number;
        rate: number;
    }
    title: string
    stock: number
    purchaseLimit?: PurchaseLimitType
}

export type PriceType = {
    amount: number;
    currency: string;
}

export type PurchaseLimitType = {
    min: number;
    max: number;
}

export type CartType = CartItemType[]

export type CartItemType = ProductType & {
    cartItemId: number
    quantity: number
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
    orderId: number
    customerData: CustomerType | null
    shippingData: ShippingType | null
    paymentIntent: PaymentType | null
    items: CartType | null
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

export type CreateOrderRequestType = {
    items: CartType,
    summary: CartSummaryType
}

export type UpdateOrderCustomerDataType = {
    orderId: number
    paymentId: string
    customerData: CustomerType
    shippingData: AddressType
}

export type UpdateOrderItemsType = {
    paymentId: string
    orderId: number
    items: CartType,
    summary: CartSummaryType
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