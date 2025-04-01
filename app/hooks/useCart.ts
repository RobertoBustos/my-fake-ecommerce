import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback } from "react";
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
    const [getCart, { loading: isLoading, refetch: reloadCart }] = useLazyQuery(GET_CART)
    const [addToCart, { loading: isAdding }] = useMutation(ADD_PRODUCT);
    const [removeFromCart, { loading: isRemoving }] = useMutation(REMOVE_PRODUCT);

    const fetchCart = useCallback(async (id: string, pollInterval: number = 0) => {
        return getCart({ variables: { filter: { field: "cartId", value: id } }, pollInterval })
    }, [getCart])

    const addProduct = useCallback(async (input: AddToCartInputType) => {
        try {
            const response = await addToCart({
                variables: {
                    input: input,
                }
            })
            return response.data.addToCart.data
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