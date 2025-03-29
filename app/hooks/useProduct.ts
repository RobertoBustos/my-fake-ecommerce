import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";

export type UseProductPropsType = {
    filter: {
        field: string
        value: string
    } | null
}

const useProduct = ({ filter }: UseProductPropsType) => {
    const { loading: isLoading, data: response, refetch, error } = useQuery(GET_PRODUCTS, {
        variables: { filter: filter }, notifyOnNetworkStatusChange: true
    });

    const shapeData = () => {
        if (!response) return undefined
        if (response.products.length === 1) return response.products[0]
        return response.products
    }

    const data = shapeData()

    return { isLoading, data, refetch, error }
}

export default useProduct