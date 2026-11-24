import { ErrorCode, ProviderEvents, StandardResolutionReasons } from "@openfeature/web-sdk";
import { getApps } from "@react-native-firebase/app";
import { activate, fetchConfig, getValue, onConfigUpdate } from "@react-native-firebase/remote-config";
import { RemoteConfigProvider } from "../providers/remoteConfig";

const mockGetApps = getApps as jest.Mock;
const mockActivate = activate as jest.Mock;
const mockFetch = fetchConfig as jest.Mock;
const mockGetValue = getValue as jest.Mock;
const mockOnConfigUpdate = onConfigUpdate as jest.Mock;

// What the console has, by key. A key it doesn't have reads as "static"
let remoteValues: Record<string, string> = {};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve));

describe("RemoteConfigProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    remoteValues = {};
    mockGetApps.mockReturnValue([{ name: "[DEFAULT]" }]);
    mockActivate.mockResolvedValue(true);
    mockFetch.mockResolvedValue(undefined);
    mockOnConfigUpdate.mockReturnValue(jest.fn());
    mockGetValue.mockImplementation((_rc, key: string) => ({
      getSource: () => (key in remoteValues ? "remote" : "static"),
      asString: () => remoteValues[key] ?? "",
    }));
  });

  afterEach(() => jest.restoreAllMocks());

  it("activates the last fetched values at launch and fetches for the next one", async () => {
    remoteValues = { "checkout_banner": "Sale" };
    const provider = new RemoteConfigProvider();
    await provider.initialize();

    expect(mockActivate).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(provider.resolveStringEvaluation("checkout_banner", "")).toEqual({
      value: "Sale",
      reason: StandardResolutionReasons.CACHED,
    });
  });

  it("doesn't wait for the fetch to be ready", async () => {
    mockFetch.mockReturnValue(new Promise(() => undefined));
    await expect(new RemoteConfigProvider().initialize()).resolves.toBeUndefined();
  });

  it("answers FLAG_NOT_FOUND for a key the console doesn't have", async () => {
    const provider = new RemoteConfigProvider();
    await provider.initialize();
    expect(provider.resolveBooleanEvaluation("disable_address_search", false).errorCode).toBe(
      ErrorCode.FLAG_NOT_FOUND,
    );
  });

  it("reads booleans and numbers from Remote Config's strings, and rejects other text", async () => {
    remoteValues = { on: "true", off: "0", limit: "5", text: "maybe", empty: "" };
    const provider = new RemoteConfigProvider();
    await provider.initialize();

    expect(provider.resolveBooleanEvaluation("on", false).value).toBe(true);
    expect(provider.resolveBooleanEvaluation("off", true).value).toBe(false);
    expect(provider.resolveNumberEvaluation("limit", 1).value).toBe(5);
    expect(provider.resolveBooleanEvaluation("text", false).errorCode).toBe(ErrorCode.TYPE_MISMATCH);
    expect(provider.resolveNumberEvaluation("empty", 1).errorCode).toBe(ErrorCode.TYPE_MISMATCH);
  });

  it("answers no flag when the build has no native Firebase app", async () => {
    mockGetApps.mockReturnValue([]);
    remoteValues = { "checkout_banner": "Sale" };
    const provider = new RemoteConfigProvider();
    await provider.initialize();

    expect(mockActivate).not.toHaveBeenCalled();
    expect(provider.resolveStringEvaluation("checkout_banner", "").errorCode).toBe(ErrorCode.FLAG_NOT_FOUND);
  });

  it("answers no flag, without failing, when activating fails", async () => {
    mockActivate.mockRejectedValue(new Error("disk"));
    remoteValues = { "checkout_banner": "Sale" };
    const provider = new RemoteConfigProvider();
    await expect(provider.initialize()).resolves.toBeUndefined();
    expect(provider.resolveStringEvaluation("checkout_banner", "").errorCode).toBe(ErrorCode.FLAG_NOT_FOUND);
  });

  it("activates a real-time update and reports the changed keys", async () => {
    const provider = new RemoteConfigProvider();
    const onChange = jest.fn();
    provider.events.addHandler(ProviderEvents.ConfigurationChanged, onChange);
    await provider.initialize();

    remoteValues = { "checkout_banner": "Now" };
    const observer = mockOnConfigUpdate.mock.calls[0][1];
    observer.next({ getUpdatedKeys: () => new Set(["checkout_banner"]) });
    await flushPromises();

    expect(mockActivate).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ flagsChanged: ["checkout_banner"] }));
    expect(provider.resolveStringEvaluation("checkout_banner", "").value).toBe("Now");
  });

  it("stops listening when closed", async () => {
    const unsubscribe = jest.fn();
    mockOnConfigUpdate.mockReturnValue(unsubscribe);
    const provider = new RemoteConfigProvider();
    await provider.initialize();
    await provider.onClose();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
