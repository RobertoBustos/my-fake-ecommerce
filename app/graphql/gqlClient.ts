import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from, fromPromise } from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { User, signOut } from "firebase/auth";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { API_URL, REQUEST_TIMEOUT_MS } from "../constants/config";
import { ApiErrorCode } from "../utils/apiErrors";
import { auth } from "../utils/firebase";
if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const MAX_CONFLICT_RETRIES = 2
const CONFLICT_RETRY_DELAY_MS = 1500

// The API reuses the X-Request-Id we send (the key to find the request in Cloud Logging),
// it is added to every error so it can be shown when reporting a problem
const requestIdLink = new ApolloLink((operation, forward) => {
  const requestId = uuidv4()
  operation.setContext(({ headers = {} }) => ({
    requestId,
    headers: { ...headers, "X-Request-Id": requestId },
  }))
  return forward(operation).map((result) => {
    if (!result.errors) return result
    return {
      ...result,
      errors: result.errors.map((error) => ({
        ...error,
        extensions: { ...error.extensions, requestId },
      })),
    }
  })
})

// The SDK returns the cached ID token and refreshes it only when it is close to expiry
const authLink = setContext(async (_, { headers = {} }) => {
  const token = await auth.currentUser?.getIdToken()
  if (!token) return { headers }
  return { headers: { ...headers, Authorization: `Bearer ${token}` } }
})

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Without a connection the session may still be valid, any other failure means it is not
const renewToken = (user: User) => user.getIdToken(true).catch(async (error) => {
  if (error?.code !== "auth/network-request-failed") await signOut(auth)
  throw error
})

const errorLink: ApolloLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // onError does not run for the result of a retry, so it goes through this link again
  const retry = () => errorLink.request(operation, forward)!
  const context = operation.getContext()
  const isUnauthenticated =
    (networkError && "statusCode" in networkError && networkError.statusCode === 401) ||
    graphQLErrors?.some((error) => error.extensions?.code === ApiErrorCode.UNAUTHENTICATED)

  if (isUnauthenticated) {
    if (context.authRetried || !auth.currentUser) {
      // The session can not be recovered, the user has to sign in again
      signOut(auth)
      return
    }
    // Force the token renewal once and retry
    operation.setContext({ authRetried: true })
    return fromPromise(renewToken(auth.currentUser)).flatMap(retry)
  }

  const conflictRetries: number = context.conflictRetries ?? 0
  const isRetryableConflict = graphQLErrors?.some(
    (error) => error.extensions?.code === ApiErrorCode.CONFLICT && error.extensions?.retryable === true
  )
  if (isRetryableConflict && conflictRetries < MAX_CONFLICT_RETRIES) {
    operation.setContext({ conflictRetries: conflictRetries + 1 })
    return fromPromise(delay(CONFLICT_RETRY_DELAY_MS)).flatMap(retry)
  }

  if (graphQLErrors) {
    graphQLErrors.map((error) => {
      console.error(`[${context.requestId}] ${error.extensions?.code}: ${error.message}`)
    })
  }
  if (networkError) {
    console.error(`[${context.requestId}] ${networkError.message}`)
    // A non-2xx answer does not go through requestIdLink as a result
    graphQLErrors?.forEach((error) => {
      Object.assign(error, { extensions: { ...error.extensions, requestId: context.requestId } })
    })
  }
})

// Cloud Run scales to zero, so the first request after a while can take a few seconds more
const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  init?.signal?.addEventListener("abort", () => controller.abort())
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeout))
}

const link = from([
  requestIdLink, errorLink, authLink, new HttpLink({ uri: API_URL, fetch: fetchWithTimeout })
])

const gqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link
});


export default gqlClient
