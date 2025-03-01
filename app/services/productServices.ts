import { ProductType } from "../constants/types"

export async function getProductsService(): Promise<ProductType[] | Error> {
    try {
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.json()
        if (data.length === 0) {
            throw { name: "general", message: 'No data found' } as Error
        }
        data.forEach((product: any) => {
            product.stock = Math.floor(Math.random() * 100)
            product.price = { amount: product.price, currency: 'USD' }
        })
        return data
    } catch (error) {
        return { name: "general", message: 'An error occurred' + error } as Error
    }
}

export async function getProductDetailsService(productId: number): Promise<ProductType | Error> {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`)
        const data = await response.json()
        data.stock = Math.floor(Math.random() * 100)
        data.price = { amount: data.price, currency: 'USD' }
        data.purchaseLimit = { min: Math.floor(Math.random() * 3), max: 10 }
        return data
    } catch (error) {
        return { name: "general", message: 'An error occurred' + error } as Error
    }
}