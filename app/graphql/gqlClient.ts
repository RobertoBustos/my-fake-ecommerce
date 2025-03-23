import { ApolloClient, InMemoryCache } from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { BASE_URL } from "../constants/config";
if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const gqlClient = new ApolloClient({
  uri: BASE_URL + "/api",
  cache: new InMemoryCache(),
});

export default gqlClient