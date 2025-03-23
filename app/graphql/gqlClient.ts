import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { onError } from "@apollo/client/link/error";
import { Alert } from "react-native";
import { BASE_URL } from "../constants/config";
if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map((error) => {
      console.error(error.message)
    })
  }
  if (networkError) {
    return Alert.alert("Network Error", networkError.message)
  }
})

const link = from([
  errorLink, new HttpLink({ uri: BASE_URL + "/api", })
])

const gqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

export default gqlClient