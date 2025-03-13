import { BASE_URL } from "../constants/config";
import { ProductType } from "../constants/types";
import { RequestType, ResponseType } from "./serviceTypes";

export async function getProductsService(): ResponseType<ProductType[] | undefined> {
    try {
        const response = await fetch(BASE_URL + '/products')
        const data = await response.json()
        if (data.error) {
            throw new Error(data.error.message)
        }
        return { data }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function getProductDetailsService(request: RequestType<number>): ResponseType<ProductType | undefined> {
    try {
        const response = await fetch(BASE_URL + `/products/${request}`)
        const data = await response.json()
        if (data.error) {
            throw new Error(data.error.message)
        }
        return { data }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export default {}