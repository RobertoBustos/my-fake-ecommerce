import * as Notifications from "expo-notifications";

// While the app is open, a notification shows as a banner unless its order is already on screen
export const shouldShowNotification = (
  notification: Notifications.Notification,
  visibleOrderId: string | undefined,
): boolean => {
  const orderId = notification.request.content.data?.orderId;
  return !(typeof orderId === "string" && orderId === visibleOrderId);
};

export const setForegroundHandler = (getVisibleOrderId: () => string | undefined) => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const show = shouldShowNotification(notification, getVisibleOrderId());
      return {
        shouldShowBanner: show,
        shouldShowList: show,
        shouldPlaySound: show,
        shouldSetBadge: false,
      };
    },
  });
};
