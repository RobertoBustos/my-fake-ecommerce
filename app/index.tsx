import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootContext from "./contexts";
import RootStack from "./navigation";
import { getVisibleOrderId, navigationRef } from "./navigation/navigationRef";
import { linking, setupNotifications } from "./notifications";
if (__DEV__) {
  require("../ReactotronConfig");
}

// Before the first render, so a notification that arrives at startup already has a handler
setupNotifications(getVisibleOrderId);

export default function Index() {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <RootContext>
          <RootStack />
        </RootContext>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
