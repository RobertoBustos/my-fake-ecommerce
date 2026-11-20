import * as Notifications from "expo-notifications";

const mockMutate = jest.fn();
const mockAuth: { currentUser: object | null } = { currentUser: { uid: "user-1" } };

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
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

const TOKEN = "ExponentPushToken[test]";
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
    mockMutate.mockResolvedValue(registered);
  });

  it("registers the token with the platform when the permission is granted", async () => {
    await loadModule().syncPushToken();
    expect(mockGetToken).toHaveBeenCalledWith({ projectId: "project-1" });
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
