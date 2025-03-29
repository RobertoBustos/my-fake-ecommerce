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
