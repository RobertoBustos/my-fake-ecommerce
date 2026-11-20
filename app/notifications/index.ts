// Everything about push notifications lives here, so screens don't import expo-notifications
import { addPushTokenListener } from "expo-notifications";
import { createNotificationChannels } from "./channels";
import { setForegroundHandler } from "./foreground";
import { syncPushToken } from "./pushToken";

export { linking } from "./linking";
export { askForNotificationPermission } from "./permission";
export { syncPushToken, unregisterPushToken } from "./pushToken";

export const setupNotifications = (getVisibleOrderId: () => string | undefined) => {
  setForegroundHandler(getVisibleOrderId);
  createNotificationChannels().catch((error) => {
    console.warn("Could not create the notification channels", error);
  });
  // The system can renew the token while the app runs
  addPushTokenListener(() => syncPushToken());
};
