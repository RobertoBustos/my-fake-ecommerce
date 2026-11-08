import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback } from "react";
import { CartItemType, ConnectionType, nodesOf } from "../constants/types";
import { ADD_PRODUCT, REMOVE_PRODUCT } from "../graphql/mutations";
import { GET_CART } from "../graphql/queries";


export type AddToCartInputType = {
    cartId: string
    productId: string
    quantity: number
    orderId: string | null
}

export type RemoveFromCartInput = {
    id: string
}

const useCart = () => {
    const [getCart, { loading: isLoading, refetch: reloadCart }] = useLazyQuery<{ carts: ConnectionType<CartItemType> }>(GET_CART, { fetchPolicy: "no-cache" })
    const [addToCart, { loading: isAdding }] = useMutation(ADD_PRODUCT);
    const [removeFromCart, { loading: isRemoving }] = useMutation(REMOVE_PRODUCT);

    // Items of the cart that are not in an order yet
    const fetchCart = useCallback(async (id: string, pollInterval: number = 0): Promise<CartItemType[]> => {
        const response = await getCart({ variables: { cartId: id, first: 100 }, pollInterval })
        return nodesOf(response.data?.carts)
    }, [getCart])

    const addProduct = useCallback(async (input: AddToCartInputType) => {
        try {
            const response = await addToCart({
                variables: {
                    input: input,
                }
            })
            return response.data.addToCart.data as CartItemType
        } catch (error) {
            throw error as Error
        }
    }, [addToCart])

    const removeProduct = useCallback(async (input: RemoveFromCartInput) => {
        try {
            const response = await removeFromCart({
                variables: {
                    input: input,
                }
            })
            return response.data.removeFromCart
        } catch (error) {
            throw error as Error
        }
    }, [removeFromCart])

    return { addProduct, isAdding, removeProduct, isRemoving, fetchCart, isLoading, reloadCart }
}

export default useCart