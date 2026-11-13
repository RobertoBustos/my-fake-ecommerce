// Registers the themes before any style sheet is created. Nothing else imports it:
// in development expo-router happens to load it as a route file, a Release build doesn't
import "./styles/config/unistyles";
import { AppRegistry } from "react-native";
import RootContext from "./contexts";
import RootStack from "./navigation";
if (__DEV__) {
  require("../ReactotronConfig");
}

export default function Index() {
  return (
    <RootContext>
      <RootStack />
    </RootContext>
  );
}

AppRegistry.registerComponent("MyFakeEcommerce", () => Index);
