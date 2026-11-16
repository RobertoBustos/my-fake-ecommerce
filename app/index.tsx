import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootContext from "./contexts";
import RootStack from "./navigation";
if (__DEV__) {
  require("../ReactotronConfig");
}

export default function Index() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootContext>
          <RootStack />
        </RootContext>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
