import { BASE_URL } from "../constants/config";
import { ProductType } from "../constants/types";

export async function getProductsService(): Promise<ProductType[] | Error> {
    try {
        const response = await fetch(BASE_URL + '/products')
        const data = await response.json()
        if (data.length === 0) {
            throw { name: "general", message: 'No data found' } as Error
        }
        return data
    } catch (error) {
        return { name: "general", message: 'An error occurred' + error } as Error
    }
}

export async function getProductDetailsService(productId: number): Promise<ProductType | Error> {
    try {
        const response = await fetch(BASE_URL + `/products/${productId}`)
        const data = await response.json()
        return data
    } catch (error) {
        return { name: "general", message: 'An error occurred' + error } as Error
    }
}

export default {}