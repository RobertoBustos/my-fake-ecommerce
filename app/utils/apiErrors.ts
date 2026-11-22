import { CombinedGraphQLErrors, ServerError, ServerParseError } from "@apollo/client/errors";
import { GraphQLFormattedError } from "graphql";

export enum ApiErrorCode {
    UNAUTHENTICATED = "UNAUTHENTICATED",
    BAD_USER_INPUT = "BAD_USER_INPUT",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export type PriceChangeType = {
    productId: string
    previousUnitPrice: number
    previousCurrency: string
    unitPrice: number
    currency: string
}

export type ApiErrorExtensions = {
    code?: string
    requestId?: string
    invalidArgument?: string
    retryable?: boolean
    priceChanges?: PriceChangeType[]
    expiredItemIds?: string[]
    unavailableProductIds?: string[]
}

// Mutations that could not make the change without a GraphQL error (success: false)
export class UnsuccessfulMutationError extends Error { }

const getFirstError = (error: unknown): GraphQLFormattedError | undefined => {
    if (CombinedGraphQLErrors.is(error)) {
        return error.errors[0]
    }
    // A non-2xx answer sent as application/json arrives unparsed, but its body can still hold the GraphQL errors
    if (ServerError.is(error)) {
        try {
            return JSON.parse(error.bodyText)?.errors?.[0]
        } catch {
            return undefined
        }
    }
    return undefined
}

// The request never got a GraphQL answer: no connection, the timeout, or a body that is not GraphQL
const isNetworkError = (error: unknown): boolean =>
    ServerError.is(error) ||
    ServerParseError.is(error) ||
    (error instanceof Error && (error.name === "AbortError" || error.message === "Network request failed"))

// Decide by extensions.code, never by the text of the message
export const getErrorExtensions = (error: unknown): ApiErrorExtensions => {
    return (getFirstError(error)?.extensions ?? {}) as ApiErrorExtensions
}

export const getErrorCode = (error: unknown): string | undefined => {
    return getErrorExtensions(error).code
}

// NOT_FOUND also answers for products, orders and cart items: invalidArgument tells them apart
export const isNotFound = (error: unknown, argument: string): boolean => {
    const { code, invalidArgument } = getErrorExtensions(error)
    return code === ApiErrorCode.NOT_FOUND && invalidArgument === argument
}

export const getErrorMessage = (error: unknown): string => {
    const graphQLError = getFirstError(error)
    if (graphQLError) {
        const { code, requestId } = graphQLError.extensions as ApiErrorExtensions
        if (code === ApiErrorCode.UNAUTHENTICATED) {
            return "Your session expired, please try again"
        }
        if (code === ApiErrorCode.INTERNAL_SERVER_ERROR && requestId) {
            return `${graphQLError.message}\nRequest id: ${requestId}`
        }
        return graphQLError.message
    }
    if (isNetworkError(error)) {
        return "We could not reach the store, please try again"
    }
    if (error instanceof Error) {
        return error.message
    }
    return "Unexpected error, please try again later"
}

export default {}
