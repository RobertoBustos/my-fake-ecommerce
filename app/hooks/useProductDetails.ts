import { useCallback, useEffect, useState } from "react";
import { ProductType } from "../constants/types";
import { getProductDetailsService } from "../services/productServices";

export const useProductDetails = (productId: number) => {
    const [response, setResponse] = useState<ProductType>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>()

    useEffect(() => {
        fetchProduct()
        return () => { }
    }, [])

    const fetchProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            //await fakeDelayPromise(2000)
            const response = await getProductDetailsService(productId);
            if ("message" in response) {
                setError(response as Error);
                return
            }
            setResponse(response);
        } catch (error: unknown) {
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    }, [])

    return { response, isLoading, error }
}