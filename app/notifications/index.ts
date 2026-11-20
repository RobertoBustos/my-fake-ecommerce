// Everything about push notifications lives here, so screens don't import expo-notifications
import { createNotificationChannels } from "./channels";
import { setForegroundHandler } from "./foreground";

export { linking } from "./linking";

export const setupNotifications = (getVisibleOrderId: () => string | undefined) => {
  setForegroundHandler(getVisibleOrderId);
  createNotificationChannels().catch((error) => {
    console.warn("Could not create the notification channels", error);
  });
};
