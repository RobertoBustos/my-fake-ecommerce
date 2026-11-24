import { ErrorCode, ProviderEvents, StandardResolutionReasons } from "@openfeature/web-sdk";
import { AppState } from "react-native";
import { GrowthBookProvider } from "../providers/growthbook";

type FeatureResult = { value: unknown; source: string; experimentResult?: { key: string } };

const mockInstance = {
  init: jest.fn(),
  evalFeature: jest.fn(),
  setAttributes: jest.fn(),
  refreshFeatures: jest.fn(),
  destroy: jest.fn(),
};
const mockConstructor = jest.fn();

jest.mock("@growthbook/growthbook", () => ({
  GrowthBook: jest.fn().mockImplementation((options: unknown) => {
    mockConstructor(options);
    return mockInstance;
  }),
  setPolyfills: jest.fn(),
  configureCache: jest.fn(),
}));

// What GrowthBook has, by feature key
let features: Record<string, FeatureResult> = {};
let appStateListener: ((state: string) => void) | undefined;
const removeAppStateListener = jest.fn();

describe("GrowthBookProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    features = {};
    mockInstance.init.mockResolvedValue({ success: true, source: "cache" });
    mockInstance.setAttributes.mockResolvedValue(undefined);
    mockInstance.refreshFeatures.mockResolvedValue(undefined);
    mockInstance.evalFeature.mockImplementation(
      (key: string) => features[key] ?? { value: null, source: "unknownFeature" },
    );
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, listener) => {
      appStateListener = listener as (state: string) => void;
      return { remove: removeAppStateListener };
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it("answers no flag without a client key", async () => {
    const provider = new GrowthBookProvider(undefined);
    await provider.initialize({});
    expect(mockConstructor).not.toHaveBeenCalled();
    expect(provider.resolveBooleanEvaluation("new_checkout", false).errorCode).toBe(ErrorCode.FLAG_NOT_FOUND);
  });

  it("splits rollouts by the user's id, taken from targetingKey", async () => {
    await new GrowthBookProvider("sdk-key").initialize({ targetingKey: "user-1", platform: "ios" });
    expect(mockConstructor).toHaveBeenCalledWith(
      expect.objectContaining({ clientKey: "sdk-key", attributes: { id: "user-1", platform: "ios" } }),
    );
    expect(mockInstance.init).toHaveBeenCalledWith(expect.objectContaining({ streaming: false }));
  });

  it("updates the attributes when the context changes", async () => {
    const provider = new GrowthBookProvider("sdk-key");
    await provider.initialize({ targetingKey: "anon-1" });
    await provider.onContextChange({ targetingKey: "anon-1" }, { targetingKey: "user-2", anonymous: false });
    expect(mockInstance.setAttributes).toHaveBeenCalledWith({ id: "user-2", anonymous: false });
  });

  it("returns a rollout's value and variant", async () => {
    features = { new_checkout: { value: true, source: "experiment", experimentResult: { key: "1" } } };
    const provider = new GrowthBookProvider("sdk-key");
    await provider.initialize({});
    expect(provider.resolveBooleanEvaluation("new_checkout", false)).toEqual({
      value: true,
      reason: StandardResolutionReasons.SPLIT,
      variant: "1",
    });
  });

  it("answers FLAG_NOT_FOUND for an unknown feature and TYPE_MISMATCH for another type", async () => {
    features = { new_checkout: { value: "yes", source: "force" } };
    const provider = new GrowthBookProvider("sdk-key");
    await provider.initialize({});
    expect(provider.resolveBooleanEvaluation("other", false).errorCode).toBe(ErrorCode.FLAG_NOT_FOUND);
    expect(provider.resolveBooleanEvaluation("new_checkout", false).errorCode).toBe(ErrorCode.TYPE_MISMATCH);
  });

  it("starts without failing when the first download fails", async () => {
    mockInstance.init.mockRejectedValue(new Error("offline"));
    features = { new_checkout: { value: true, source: "force" } };
    const provider = new GrowthBookProvider("sdk-key");
    await expect(provider.initialize({})).resolves.toBeUndefined();
    expect(provider.resolveBooleanEvaluation("new_checkout", false).value).toBe(true);
  });

  it("refreshes on returning to the foreground and reports the change", async () => {
    const provider = new GrowthBookProvider("sdk-key");
    const onChange = jest.fn();
    provider.events.addHandler(ProviderEvents.ConfigurationChanged, onChange);
    await provider.initialize({});

    appStateListener?.("background");
    expect(mockInstance.refreshFeatures).not.toHaveBeenCalled();
    appStateListener?.("active");
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockInstance.refreshFeatures).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalled();
  });

  it("stops listening and destroys GrowthBook when closed", async () => {
    const provider = new GrowthBookProvider("sdk-key");
    await provider.initialize({});
    await provider.onClose();
    expect(removeAppStateListener).toHaveBeenCalled();
    expect(mockInstance.destroy).toHaveBeenCalled();
  });
});
