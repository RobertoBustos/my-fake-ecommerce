import { CartItemType, } from "../constants/types";
import { saveToAsyncStorage } from "../utils/asyncStorageUtils";
import { RequestType, ResponseType } from "./serviceTypes";


export async function saveCartDataService(request: RequestType<CartItemType[]>): ResponseType<boolean> {
    try {
        await saveToAsyncStorage("shoppingCart", JSON.stringify(request));
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export default {}