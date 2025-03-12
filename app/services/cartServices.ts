import { CartItemType, } from "../constants/types";
import { getFromAsyncStorage, saveToAsyncStorage } from "../utils/saveToAsyncStorage";
import { RequestType, ResponseType } from "./serviceTypes";

export async function fetchCartService(): ResponseType<CartItemType[] | undefined> {
    try {
        const data = await getFromAsyncStorage("shoppingCart")
        if (data === null) {
            return { data: undefined }
        }
        return { data: JSON.parse(data) as CartItemType[] }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}
export async function saveCartDataService(request: RequestType<CartItemType[]>): ResponseType<boolean> {
    try {
        await saveToAsyncStorage("shoppingCart", JSON.stringify(request));
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export default {}