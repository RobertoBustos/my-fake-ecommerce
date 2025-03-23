import { ApolloProvider } from "@apollo/client";
import React from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import RootContext from "./contexts";
import gqlClient from "./graphql/gqlClient";
import RootStack from "./navigation";
import store from "./redux/store";
if (__DEV__) {
  require("../ReactotronConfig");
}

export default function Index() {
  return (
    <Provider store={store}>
      <RootContext>
        <ApolloProvider client={gqlClient}>
          <RootStack />
        </ApolloProvider>
      </RootContext>
    </Provider>
  );
}

AppRegistry.registerComponent("MyFakeEcommerce", () => Index);
