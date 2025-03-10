import { CartType, RequestType, ResponseType } from "../constants/types";
import { getFromAsyncStorage, saveToAsyncStorage } from "../utils/saveToAsyncStorage";

export async function fetchCartService(): ResponseType<CartType | undefined> {
    try {
        const data = await getFromAsyncStorage("shoppingCart")
        if (data === null) {
            return { data: undefined }
        }
        return { data: JSON.parse(data) as CartType }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}
export async function saveCartDataService(request: RequestType<CartType>): ResponseType<boolean> {
    try {
        await saveToAsyncStorage("shoppingCart", JSON.stringify(request));
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}