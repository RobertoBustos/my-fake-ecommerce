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
        variables: { filter: filter }, notifyOnNetworkStatusChange: true, fetchPolicy: "no-cache"
    });

    const data: ProductType[] = response ? response.products : []

    const isCatalogEmpty = data.length === 0

    return { isLoading, data, refetch, error, isCatalogEmpty }
}

export default useProduct