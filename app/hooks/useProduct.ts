import { useQuery } from "@apollo/client";
import { ProductType } from "../constants/types";
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

    const data: ProductType[] = response ? response.products : []

    return { isLoading, data, refetch, error }
}

export default useProduct