import { Region } from "react-native-maps";

export type RootStackParamList = {
    Login: undefined
    Products: undefined
    Product: { productId: string };
    Cart: undefined
    Customer: { orderId: string, goBack?: boolean }
    Address: { orderId: string, goBack?: boolean }
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
    title: string
    stock: number
    purchaseLimits: PurchaseLimitType
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
    currency: string
    product: ProductType
}

export type UserType = {
    email: string
    name: string
    phone: string
}

export type AddressType = {
    address: string
    zipCode: string
    coords: Region
}

export enum Status {
    INCOMPLETE = "INCOMPLETE",
    PAYMENT_PENDING = "PAYMENT_PENDING",
    COMPLETE = "COMPLETE",
    CANCELLED = "CANCELLED"
}

export type OrderType = {
    id: string
    customer: CustomerType | null
    address: AddressType | null
    payment: PaymentType | null
    cart: string
    totals: TotalsType
    status: Status
    details: CartItemType[]
}

export type IncompleteOrderType = {
    id: string;
    status: Status
    totals: {
        currency: string;
        total: number;
    };
    details: CartItemType[]
};

export type PageInfoType = {
    hasNextPage: boolean
    endCursor: string | null
}

// Lists come as Relay connections: edges { node cursor } and pageInfo
export type ConnectionType<T> = {
    edges: { node: T }[]
    pageInfo?: PageInfoType
}

export const nodesOf = <T>(connection?: ConnectionType<T> | null): T[] => {
    return connection ? connection.edges.map((edge) => edge.node) : []
}

// Every mutation of the API answers with this shape
export type MutationResponseType<T = never> = {
    code: string
    success: boolean
    message: string
    data?: T | null
}

// A GraphQL error rejects the request, so a resolved one has data; Apollo 4 types it as optional
export const dataOf = <T>(data: T | undefined): T => {
    if (data === undefined) throw new Error("The API answered without data")
    return data
}

export type CustomerType = {
    id: string
    email: string
    name: string
    phone: string
}

export type PaymentType = {
    id: string
    amount: number
    status: string
    customer: string
    payment_method: string | null
    paymentDetails: PaymentMethodType | null
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