import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { getFromAsyncStorage, saveToAsyncStorage } from "./asyncStorageUtils";

// The cart belongs to the signed in user and can only become an order once,
// so its id is kept per user and replaced after the order is completed or cancelled
const getCartIdKey = (userId: string) => `cart_id_${userId}`

export const createCartId = async (userId: string): Promise<string | undefined> => {
    const newCartId = uuidv4()
    const saved = await saveToAsyncStorage(getCartIdKey(userId), newCartId)
    return saved ? newCartId : undefined
}

export const getCartId = async (userId: string): Promise<string | undefined> => {
    const cartId = await getFromAsyncStorage(getCartIdKey(userId))
    if (cartId === null) {
        return createCartId(userId)
    }
    return cartId
}

export default {}
