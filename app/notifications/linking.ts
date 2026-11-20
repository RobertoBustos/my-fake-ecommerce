import { LinkingOptions } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Linking } from "react-native";
import { RootStackParamList } from "../constants/types";

// The scheme in app.config.ts. A link to the root opens the catalog
export const APP_URL = "myapp://";

const ORDER_PATH = /^orders\/[^/?#]+$/;

// The URL to open for a link or a notification: its order, or the catalog for anything else
export const toAppUrl = (url: unknown): string => {
  if (typeof url === "string" && url.startsWith(APP_URL) && ORDER_PATH.test(url.slice(APP_URL.length))) {
    return url;
  }
  return APP_URL;
};

export const getNotificationUrl = (response: Notifications.NotificationResponse): string =>
  toAppUrl(response.notification.request.content.data?.url);

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [APP_URL],
  config: {
    // A link that opens an order keeps the catalog below it, so back goes somewhere
    initialRouteName: "Products",
    screens: {
      Products: "",
      Confirmation: "orders/:orderId",
    },
  },
  // A link, or the notification that opened the app while it was closed
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;
    const response = Notifications.getLastNotificationResponse();
    if (!response) return null;
    // Otherwise the same notification opens its order again on the next reload
    Notifications.clearLastNotificationResponse();
    return getNotificationUrl(response);
  },
  // Links and notifications tapped while the app is open or in the background
  subscribe(listener) {
    const linkSubscription = Linking.addEventListener("url", ({ url }) => listener(url));
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      Notifications.clearLastNotificationResponse();
      listener(getNotificationUrl(response));
    });
    return () => {
      linkSubscription.remove();
      responseSubscription.remove();
    };
  },
};
