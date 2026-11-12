import { NetworkStatus, useQuery } from "@apollo/client";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";
import { ConnectionType, ProductType, nodesOf } from "../constants/types";
import { GET_PRODUCTS } from "../graphql/queries";
import { ApiErrorCode, getErrorCode, getErrorMessage } from "../utils/apiErrors";

const PAGE_SIZE = 20

export type UseProductPropsType = {
    id?: string
}

const useProduct = ({ id }: UseProductPropsType) => {
    const { loading: isLoading, data: response, refetch, error, fetchMore, networkStatus } = useQuery<{ products: ConnectionType<ProductType> }>(GET_PRODUCTS, {
        variables: { id, first: PAGE_SIZE }, notifyOnNetworkStatusChange: true, fetchPolicy: "no-cache"
    });
    const isRequestingPage = useRef(false)
    // networkStatus stays on fetchMore after a failed page, so it can't tell if one is loading
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const data: ProductType[] = nodesOf(response?.products)
    const pageInfo = response?.products.pageInfo
    const hasNextPage = pageInfo?.hasNextPage ?? false
    const isRefreshing = networkStatus === NetworkStatus.refetch

    const isCatalogEmpty = data.length === 0

    // The stock of the list is a reference only, addToCart checks the real one
    const loadMore = useCallback(async () => {
        if (!pageInfo?.hasNextPage || isRequestingPage.current) return
        isRequestingPage.current = true
        setIsLoadingMore(true)
        try {
            await fetchMore({
                variables: { after: pageInfo.endCursor },
                updateQuery: (previous, { fetchMoreResult }) => ({
                    products: {
                        ...fetchMoreResult.products,
                        edges: [...previous.products.edges, ...fetchMoreResult.products.edges],
                    },
                }),
            })
        } catch (error) {
            // The only input here is the cursor: when the API does not know it, start over
            if (getErrorCode(error) === ApiErrorCode.BAD_USER_INPUT) {
                refetch().catch((refetchError) => Alert.alert(getErrorMessage(refetchError)))
            } else {
                Alert.alert(getErrorMessage(error))
            }
        } finally {
            isRequestingPage.current = false
            setIsLoadingMore(false)
        }
    }, [fetchMore, pageInfo, refetch])

    return { isLoading, isRefreshing, isLoadingMore, data, refetch, error, isCatalogEmpty, loadMore, hasNextPage }
}

export default useProduct
