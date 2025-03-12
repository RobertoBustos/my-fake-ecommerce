import { useCallback, useEffect, useState } from "react";
import { ProductType } from "../constants/types";
import { getProductsService } from "../services/productServices";

const useProducts = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>()

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
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

    const findProductById = (productId: number): ProductType | undefined => {
        const productIndex = products.findIndex((product) => {
            return product.id === productId;
        });
        if (productIndex !== -1) {
            return products[productIndex];
        }
    }

    useEffect(() => {
        fetchProducts()
        return () => { }
    }, [fetchProducts])

    return { products, isLoading, error, findProductById }
}
export default useProducts