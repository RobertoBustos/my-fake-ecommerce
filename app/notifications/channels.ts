import { AndroidImportance, setNotificationChannelAsync } from "expo-notifications";
import { Platform } from "react-native";

// The default channel in app.config.ts. Android keeps a channel's settings once it exists,
// so the id never changes
export const ORDERS_CHANNEL_ID = "orders";

// Android 13 asks for the notification permission only once a channel exists, so this runs
// at startup, before the app asks
export const createNotificationChannels = async () => {
  if (Platform.OS !== "android") return;
  await setNotificationChannelAsync(ORDERS_CHANNEL_ID, {
    name: "Orders",
    importance: AndroidImportance.HIGH,
  });
};
