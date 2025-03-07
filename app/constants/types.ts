export type RootStackParamList = {
    Products: undefined;
    Product: { productId: number };
    Cart: undefined;
    Checkout: undefined;
    Confirmation: undefined
}

export type RequestType<T> = T

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
    subTotal: number
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
    orderId: number | null
    customerData: CustomerType | null
    shippingData: ShippingType | null
    items: CartType | null
    summary: CartSummaryType | null
    paymentIntent: PaymentType | null
    status: "incomplete" | "payment_pending" | "complete" | "cancelled"
}

export type CustomerType = UserType & { customerId: string }

export type ShippingType = AddressType

export type CreateOrderRequestType = {
    items: CartType,
    summary: CartSummaryType
}

export type UpdateOrderRequestType = CreateOrderRequestType & {
    orderId: number
    customerData: UserType | null
}

export type UpdateOrderCustomerDataType = {
    orderId: number
    customerData: UserType
}

export type UpdateCustomerShippingDataType = {
    orderId: number
    shippingData: AddressType
}

export type StripeCustomerType = {
    id: string
    name: string
    email: string
}

export type CreatePaymentType = {
    amount: number
    currency: string
    customerId: string
}

export type PaymentType = {
    clientSecret: string
    ephemeralKey: string
}