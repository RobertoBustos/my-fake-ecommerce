export type RootStackParamList = {
    Products: undefined;
    Product: { productId: number };
    Cart: undefined;
    Checkout: undefined
}

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

export type CartType = {
    items: CartItemType[]
}

export type CartItemType = {
    item: ProductType
    quantity: number
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
    firstName: string
    lastName: string
}

export type AddressType = {
    address: string
    zipCode: number
}