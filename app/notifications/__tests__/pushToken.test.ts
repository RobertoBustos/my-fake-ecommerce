import * as Notifications from "expo-notifications";

const mockMutate = jest.fn();
const mockAuth: { currentUser: object | null } = { currentUser: { uid: "user-1" } };

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  getDevicePushTokenAsync: jest.fn(),
}));
jest.mock("expo-constants", () => ({
  expoConfig: { extra: { eas: { projectId: "project-1" } } },
}));
jest.mock("../../graphql/gqlClient", () => ({
  mutate: (...args: unknown[]) => mockMutate(...args),
}));
jest.mock("../../utils/firebase", () => ({ auth: mockAuth }));

const mockGetPermissions = Notifications.getPermissionsAsync as jest.Mock;
const mockGetToken = Notifications.getExpoPushTokenAsync as jest.Mock;
const mockGetDeviceToken = Notifications.getDevicePushTokenAsync as jest.Mock;

const TOKEN = "ExponentPushToken[test]";
const DEVICE_TOKEN = { type: "ios", data: "device-1" };
const registered = { data: { registerPushToken: { success: true, message: "" } } };

// The registered token lives in the module, so every test starts from a fresh copy
const loadModule = () => {
  let pushToken: typeof import("../pushToken");
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    pushToken = require("../pushToken");
  });
  return pushToken!;
};

describe("syncPushToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    mockAuth.currentUser = { uid: "user-1" };
    mockGetPermissions.mockResolvedValue({ granted: true });
    mockGetToken.mockResolvedValue({ data: TOKEN });
    mockGetDeviceToken.mockResolvedValue(DEVICE_TOKEN);
    mockMutate.mockResolvedValue(registered);
  });

  it("registers the token with the platform when the permission is granted", async () => {
    await loadModule().syncPushToken();
    expect(mockGetToken).toHaveBeenCalledWith({
      projectId: "project-1",
      devicePushToken: DEVICE_TOKEN,
    });
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { input: { token: TOKEN, platform: "IOS" } } })
    );
  });

  it("registers nothing without the permission", async () => {
    mockGetPermissions.mockResolvedValue({ granted: false });
    await loadModule().syncPushToken();
    expect(mockGetToken).not.toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("registers nothing without a session", async () => {
    mockAuth.currentUser = null;
    await loadModule().syncPushToken();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("only logs a network error", async () => {
    mockMutate.mockRejectedValue(new Error("Network request failed"));
    await expect(loadModule().syncPushToken()).resolves.toBeUndefined();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe("unregisterPushToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    mockAuth.currentUser = { uid: "user-1" };
    mockGetPermissions.mockResolvedValue({ granted: true });
    mockGetToken.mockResolvedValue({ data: TOKEN });
    mockGetDeviceToken.mockResolvedValue(DEVICE_TOKEN);
  });

  it("deletes the token registered for the session", async () => {
    mockMutate.mockResolvedValue(registered);
    const { syncPushToken, unregisterPushToken } = loadModule();
    await syncPushToken();
    mockMutate.mockClear();

    await unregisterPushToken();
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { input: { token: TOKEN } } })
    );
  });

  it("does nothing when no token was registered", async () => {
    mockMutate.mockResolvedValue({
      data: { registerPushToken: { success: false, message: "Invalid token" } },
    });
    const { syncPushToken, unregisterPushToken } = loadModule();
    await syncPushToken();
    mockMutate.mockClear();

    await unregisterPushToken();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("doesn't throw when the request fails, so signing out goes on", async () => {
    mockMutate.mockResolvedValueOnce(registered).mockRejectedValueOnce(new Error("Network"));
    const { syncPushToken, unregisterPushToken } = loadModule();
    await syncPushToken();
    await expect(unregisterPushToken()).resolves.toBeUndefined();
  });
});

describe("onDevicePushTokenChange", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    mockAuth.currentUser = { uid: "user-1" };
    mockGetPermissions.mockResolvedValue({ granted: true });
    mockGetToken.mockResolvedValue({ data: TOKEN });
    mockGetDeviceToken.mockResolvedValue(DEVICE_TOKEN);
    mockMutate.mockResolvedValue(registered);
  });

  // Fetching the token fires the listener with the same device token
  it("ignores the device token the last sync fetched", async () => {
    const { syncPushToken, onDevicePushTokenChange } = loadModule();
    await syncPushToken();
    mockMutate.mockClear();

    onDevicePushTokenChange(DEVICE_TOKEN as Notifications.DevicePushToken);
    await new Promise(process.nextTick);
    expect(mockGetDeviceToken).toHaveBeenCalledTimes(1);
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("registers again when the system renews the device token", async () => {
    const { syncPushToken, onDevicePushTokenChange } = loadModule();
    await syncPushToken();
    mockMutate.mockClear();
    const renewed = { type: "ios", data: "device-2" } as Notifications.DevicePushToken;
    mockGetDeviceToken.mockResolvedValue(renewed);

    onDevicePushTokenChange(renewed);
    await new Promise(process.nextTick);
    expect(mockMutate).toHaveBeenCalledTimes(1);

    // The sync's own fetch fires the listener again, with the token it already has
    onDevicePushTokenChange(renewed);
    await new Promise(process.nextTick);
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});
