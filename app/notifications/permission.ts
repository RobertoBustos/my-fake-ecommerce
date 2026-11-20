import { getPermissionsAsync, requestPermissionsAsync } from "expo-notifications";
import { Alert } from "react-native";
import { syncPushToken } from "./pushToken";

export const PERMISSION_PROMPT_TITLE = "Get notified when your payment is confirmed";

// Asked at most once per app start, so paying again after "Not now" doesn't ask again
let hasAsked = false;

const askInApp = () =>
  new Promise<boolean>((resolve) => {
    Alert.alert(
      PERMISSION_PROMPT_TITLE,
      "We'll let you know when your order is confirmed or if the payment fails.",
      [
        { text: "Not now", style: "cancel", onPress: () => resolve(false) },
        { text: "Allow", onPress: () => resolve(true) },
      ],
      { cancelable: false }
    );
  });

// Asks before paying, with the app's own prompt first: the system dialog shows only if the
// user accepts, because iOS shows it only once. Nothing here stops the payment
export const askForNotificationPermission = async () => {
  try {
    if (hasAsked) return;
    const { granted, canAskAgain } = await getPermissionsAsync();
    // Once denied for good, only the system settings can change it
    if (granted || !canAskAgain) return;
    hasAsked = true;
    if (!(await askInApp())) return;
    const { granted: isGranted } = await requestPermissionsAsync();
    if (isGranted) syncPushToken();
  } catch (error) {
    console.warn("Could not ask for the notification permission", error);
  }
};
