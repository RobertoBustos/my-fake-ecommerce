import { ApolloProvider } from "@apollo/client";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider as ReduxProvider } from "react-redux";
import gqlClient from "../graphql/gqlClient";
import store from "../redux/store";
import AuthStore from "./AuthContext";
import SiblingStore from "./SiblingContext";
import StripeStore from "./StripeContext";

export type RootContextType = {
  children: React.JSX.Element;
};

const RootContext = ({ children }: RootContextType) => {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={gqlClient}>
        <AuthStore>
          <SiblingStore>
            <StripeStore>
              <KeyboardProvider>{children}</KeyboardProvider>
            </StripeStore>
          </SiblingStore>
        </AuthStore>
      </ApolloProvider>
    </ReduxProvider>
  );
};

export default RootContext;
