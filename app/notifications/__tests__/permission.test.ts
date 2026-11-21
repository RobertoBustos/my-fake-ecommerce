import * as Notifications from "expo-notifications";
import { Alert, AlertButton } from "react-native";

const mockSyncPushToken = jest.fn();

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
}));
jest.mock("../pushToken", () => ({ syncPushToken: () => mockSyncPushToken() }));

const mockGetPermissions = Notifications.getPermissionsAsync as jest.Mock;
const mockRequestPermissions = Notifications.requestPermissionsAsync as jest.Mock;

// Whether the prompt was shown lives in the module, so every test starts from a fresh copy
const loadModule = () => {
  let permission: typeof import("../permission");
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    permission = require("../permission");
  });
  return permission!;
};

// Answers the app's own prompt with the button that has this text
const answerPrompt = (text: "Allow" | "Not now") =>
  jest.spyOn(Alert, "alert").mockImplementation((_title, _message, buttons?: AlertButton[]) => {
    buttons?.find((button) => button.text === text)?.onPress?.();
  });

describe("askForNotificationPermission", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    mockGetPermissions.mockResolvedValue({ granted: false, canAskAgain: true });
    mockRequestPermissions.mockResolvedValue({ granted: true });
  });

  it("asks the system and registers the token when the user allows", async () => {
    const alert = answerPrompt("Allow");
    await loadModule().askForNotificationPermission();
    expect(alert).toHaveBeenCalledWith(
      "Get notified when your payment is confirmed",
      expect.any(String),
      expect.any(Array),
      expect.anything()
    );
    expect(mockRequestPermissions).toHaveBeenCalled();
    expect(mockSyncPushToken).toHaveBeenCalled();
  });

  it("doesn't register when the system dialog is denied", async () => {
    answerPrompt("Allow");
    mockRequestPermissions.mockResolvedValue({ granted: false });
    await loadModule().askForNotificationPermission();
    expect(mockSyncPushToken).not.toHaveBeenCalled();
  });

  it("doesn't show the system dialog after Not now, nor the prompt again", async () => {
    const alert = answerPrompt("Not now");
    const { askForNotificationPermission } = loadModule();
    await askForNotificationPermission();
    await askForNotificationPermission();
    expect(alert).toHaveBeenCalledTimes(1);
    expect(mockRequestPermissions).not.toHaveBeenCalled();
  });

  it("doesn't ask when the permission is already granted", async () => {
    const alert = answerPrompt("Allow");
    mockGetPermissions.mockResolvedValue({ granted: true, canAskAgain: true });
    await loadModule().askForNotificationPermission();
    expect(alert).not.toHaveBeenCalled();
  });

  it("doesn't ask when the system won't show its dialog again", async () => {
    const alert = answerPrompt("Allow");
    mockGetPermissions.mockResolvedValue({ granted: false, canAskAgain: false });
    await loadModule().askForNotificationPermission();
    expect(alert).not.toHaveBeenCalled();
  });

  it("goes on to the payment when the permission can't be read", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    mockGetPermissions.mockRejectedValue(new Error("Not available"));
    await expect(loadModule().askForNotificationPermission()).resolves.toBeUndefined();
  });
});
