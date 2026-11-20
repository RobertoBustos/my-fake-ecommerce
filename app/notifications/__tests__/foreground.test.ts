import * as Notifications from "expo-notifications";
import { setForegroundHandler, shouldShowNotification } from "../foreground";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
}));

const mockSetNotificationHandler = Notifications.setNotificationHandler as jest.Mock;

const notification = (data: Record<string, unknown>) =>
  ({ request: { content: { data } } }) as unknown as Notifications.Notification;

const orderCompleted = notification({
  type: "order_completed",
  orderId: "order-1",
  url: "myapp://orders/order-1",
});

describe("shouldShowNotification", () => {
  it("shows a notification while no order is on screen", () => {
    expect(shouldShowNotification(orderCompleted, undefined)).toBe(true);
  });

  it("shows a notification for a different order than the one on screen", () => {
    expect(shouldShowNotification(orderCompleted, "order-2")).toBe(true);
  });

  it("hides a notification for the order already on screen", () => {
    expect(shouldShowNotification(orderCompleted, "order-1")).toBe(false);
  });

  it("shows a notification without an order", () => {
    expect(shouldShowNotification(notification({}), "order-1")).toBe(true);
  });
});

describe("setForegroundHandler", () => {
  const handle = async (visibleOrderId: string | undefined) => {
    setForegroundHandler(() => visibleOrderId);
    const { handleNotification } = mockSetNotificationHandler.mock.calls.at(-1)[0];
    return handleNotification(orderCompleted);
  };

  it("shows the banner, the list entry and the sound", async () => {
    await expect(handle(undefined)).resolves.toEqual({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    });
  });

  it("stays silent when the order is on screen", async () => {
    await expect(handle("order-1")).resolves.toEqual({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    });
  });
});
