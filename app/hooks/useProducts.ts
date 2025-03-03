import { useCallback, useEffect, useState } from "react";
import { ProductType } from "../constants/types";
import { getProductsService } from "../services/productServices";

export const useProducts = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>()

    useEffect(() => {
        fetchProducts()

        return () => { }
    }, [])

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            //await fakeDelayPromise(2000)
            const response = await getProductsService();
            if ("message" in response) {
                setError(response as Error);
                return
            }
            setProducts(response);
        } catch (error: unknown) {
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    }, [])

    return { products, isLoading, error }
}