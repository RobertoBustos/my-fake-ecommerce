import { getStateFromPath } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Linking } from "react-native";
import { APP_URL, getNotificationUrl, linking, toAppUrl } from "../linking";

jest.mock("expo-notifications", () => ({
  getLastNotificationResponse: jest.fn(),
  clearLastNotificationResponse: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
}));

const mockGetLastResponse = Notifications.getLastNotificationResponse as jest.Mock;
const mockClearLastResponse = Notifications.clearLastNotificationResponse as jest.Mock;
const mockAddResponseListener = Notifications.addNotificationResponseReceivedListener as jest.Mock;

const response = (data: Record<string, unknown>) =>
  ({ notification: { request: { content: { data } } } }) as unknown as Notifications.NotificationResponse;

describe("toAppUrl", () => {
  it("keeps an order URL", () => {
    expect(toAppUrl("myapp://orders/order-1")).toBe("myapp://orders/order-1");
  });

  it("opens the catalog without a URL", () => {
    expect(toAppUrl(undefined)).toBe(APP_URL);
  });

  it("opens the catalog for an unknown route", () => {
    expect(toAppUrl("myapp://products/1")).toBe(APP_URL);
    expect(toAppUrl("myapp://orders/")).toBe(APP_URL);
  });

  it("opens the catalog for another scheme", () => {
    expect(toAppUrl("https://example.com/orders/order-1")).toBe(APP_URL);
  });
});

describe("getNotificationUrl", () => {
  it("reads the URL from the notification data", () => {
    expect(getNotificationUrl(response({ url: "myapp://orders/order-1" }))).toBe("myapp://orders/order-1");
  });

  it("opens the catalog when the notification has no URL", () => {
    expect(getNotificationUrl(response({ orderId: "order-1" }))).toBe(APP_URL);
  });
});

describe("linking config", () => {
  const stateFor = (url: string) =>
    getStateFromPath(url.slice(APP_URL.length), linking.config);

  it("opens the order's confirmation on top of the catalog", () => {
    const state = stateFor("myapp://orders/order-1");
    expect(state?.routes.map((route) => route.name)).toEqual(["Products", "Confirmation"]);
    expect(state?.routes[1].params).toEqual({ orderId: "order-1" });
  });

  it("opens the catalog for the root", () => {
    expect(stateFor(APP_URL)?.routes.map((route) => route.name)).toEqual(["Products"]);
  });
});

describe("getInitialURL", () => {
  beforeEach(() => {
    jest.spyOn(Linking, "getInitialURL").mockResolvedValue(null);
    mockGetLastResponse.mockReturnValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("opens the link that launched the app", async () => {
    jest.spyOn(Linking, "getInitialURL").mockResolvedValue("myapp://orders/order-2");
    await expect(linking.getInitialURL!()).resolves.toBe("myapp://orders/order-2");
  });

  it("opens the order of the notification that launched the app, once", async () => {
    mockGetLastResponse.mockReturnValue(response({ url: "myapp://orders/order-1" }));
    await expect(linking.getInitialURL!()).resolves.toBe("myapp://orders/order-1");
    expect(mockClearLastResponse).toHaveBeenCalled();
  });

  it("opens nothing special on a normal launch", async () => {
    await expect(linking.getInitialURL!()).resolves.toBeNull();
  });
});

describe("subscribe", () => {
  it("opens the order of a notification tapped while the app runs", () => {
    const removeLink = jest.fn();
    const removeResponse = jest.fn();
    jest.spyOn(Linking, "addEventListener").mockReturnValue({ remove: removeLink } as never);
    mockAddResponseListener.mockReturnValue({ remove: removeResponse });
    const listener = jest.fn();

    const unsubscribe = linking.subscribe!(listener) as () => void;
    mockAddResponseListener.mock.calls[0][0](response({ url: "myapp://orders/order-1" }));
    expect(listener).toHaveBeenCalledWith("myapp://orders/order-1");

    unsubscribe();
    expect(removeLink).toHaveBeenCalled();
    expect(removeResponse).toHaveBeenCalled();
  });
});
