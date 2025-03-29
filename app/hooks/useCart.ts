import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { ADD_PRODUCT, REMOVE_PRODUCT } from "../graphql/mutations";


export type AddToCartInputType = {
    cartId: string
    productId: string
    quantity: number
}

export type RemoveFromCartInput = {
    id: string
}

const useCart = () => {
    const [addToCart, { loading: isAdding }] = useMutation(ADD_PRODUCT);
    const [removeFromCart, { loading: isRemoving }] = useMutation(REMOVE_PRODUCT);

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

    return { addProduct, isAdding, removeProduct, isRemoving }
}

export default useCart