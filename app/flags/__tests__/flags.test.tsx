import { InMemoryProvider, OpenFeature } from "@openfeature/web-sdk";
import { getApps } from "@react-native-firebase/app";
import { getValue, onConfigUpdate } from "@react-native-firebase/remote-config";
import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { defineFlag, FLAG_KEY_PATTERN, flags as registry } from "../registry";
import { flagValue, setupFlags, useFlag } from "..";

jest.mock("expo-constants", () => ({ expoConfig: { extra: {} } }));

const newCheckout = defineFlag({
  key: "new_checkout",
  owner: "release",
  default: false,
  description: "Test release flag",
  responsible: "mobile",
  removeBy: "2026-12-31",
});
const maxItems = defineFlag({ key: "max_items", owner: "ops", default: 10, description: "Test ops flag" });

const FlagText = () => {
  const banner = useFlag(registry.checkoutBanner);
  const enabled = useFlag(newCheckout);
  return <Text>{`${banner}|${enabled}`}</Text>;
};

// Builds without a native Firebase app log that Remote Config is off
beforeEach(() => jest.spyOn(console, "warn").mockImplementation(() => undefined));
afterEach(() => jest.restoreAllMocks());

describe("registry", () => {
  it("names every flag in snake_case, which Remote Config requires", () => {
    for (const flag of Object.values(registry)) {
      expect(flag.key).toMatch(FLAG_KEY_PATTERN);
    }
  });

  it("declares each key once", () => {
    const keys = Object.values(registry).map((flag) => flag.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("flags", () => {
  afterEach(async () => {
    await OpenFeature.clearProviders();
  });

  it("reads the default when no provider knows the flag", async () => {
    await setupFlags({});
    expect(flagValue(registry.checkoutBanner)).toBe("");
    expect(flagValue(newCheckout)).toBe(false);
    expect(flagValue(maxItems)).toBe(10);
  });

  it("reads the build override ahead of the default", async () => {
    await setupFlags({ "checkout_banner": "Free shipping", "new_checkout": true, "max_items": 3 });
    expect(flagValue(registry.checkoutBanner)).toBe("Free shipping");
    expect(flagValue(newCheckout)).toBe(true);
    expect(flagValue(maxItems)).toBe(3);
  });

  it("keeps the default when an override has the wrong type", async () => {
    await setupFlags({ "new_checkout": "yes" });
    expect(flagValue(newCheckout)).toBe(false);
  });

  it("asks each flag's own domain", async () => {
    await OpenFeature.setProviderAndWait(
      "release",
      new InMemoryProvider({ "max_items": { variants: { low: 1 }, defaultVariant: "low", disabled: false } }),
    );
    // The release domain knows max_items, but the flag is an ops flag
    expect(flagValue(maxItems)).toBe(10);
  });

  it("re-renders an ops flag when it changes, and keeps a release flag until the next mount", async () => {
    const release = new InMemoryProvider({
      "new_checkout": { variants: { on: true, off: false }, defaultVariant: "off", disabled: false },
    });
    const ops = new InMemoryProvider({
      "checkout_banner": { variants: { sale: "Sale", none: "" }, defaultVariant: "sale", disabled: false },
    });
    await OpenFeature.setProviderAndWait("release", release);
    await OpenFeature.setProviderAndWait("ops", ops);

    const { unmount } = await render(<FlagText />);
    expect(screen.getByText("Sale|false")).toBeTruthy();

    // A kill switch applies on the open screen
    await act(() =>
      ops.putConfiguration({
        "checkout_banner": { variants: { sale: "Sale", none: "" }, defaultVariant: "none", disabled: false },
      }),
    );
    expect(screen.getByText("|false")).toBeTruthy();

    // A release flag doesn't change the open screen
    await act(() =>
      release.putConfiguration({
        "new_checkout": { variants: { on: true, off: false }, defaultVariant: "on", disabled: false },
      }),
    );
    expect(screen.getByText("|false")).toBeTruthy();
    expect(flagValue(newCheckout)).toBe(true);

    // The next screen gets the new value
    await unmount();
    await render(<FlagText />);
    expect(screen.getByText("|true")).toBeTruthy();
  });

  it("renders the default until the providers are ready, then the override", async () => {
    await render(<FlagText />);
    expect(screen.getByText("|false")).toBeTruthy();

    await act(async () => {
      await setupFlags({ "checkout_banner": "Free shipping" });
    });
    expect(screen.getByText("Free shipping|false")).toBeTruthy();
  });
});

describe("flags from Remote Config", () => {
  let remoteValues: Record<string, string>;

  beforeEach(() => {
    remoteValues = { "checkout_banner": "From the console" };
    (getApps as jest.Mock).mockReturnValue([{ name: "[DEFAULT]" }]);
    (getValue as jest.Mock).mockImplementation((_rc, key: string) => ({
      getSource: () => (key in remoteValues ? "remote" : "static"),
      asString: () => remoteValues[key] ?? "",
    }));
  });

  afterEach(async () => {
    await OpenFeature.clearProviders();
    (getApps as jest.Mock).mockReturnValue([]);
  });

  it("answers ops flags, behind the build overrides", async () => {
    await setupFlags({});
    expect(flagValue(registry.checkoutBanner)).toBe("From the console");
    await OpenFeature.clearProviders();

    await setupFlags({ "checkout_banner": "Pinned" });
    expect(flagValue(registry.checkoutBanner)).toBe("Pinned");
  });

  it("re-renders a component on a real-time update", async () => {
    await setupFlags({});
    await render(<FlagText />);
    expect(screen.getByText("From the console|false")).toBeTruthy();

    remoteValues = { "checkout_banner": "" };
    const observer = (onConfigUpdate as jest.Mock).mock.calls.at(-1)[1];
    await act(async () => {
      observer.next({ getUpdatedKeys: () => new Set(["checkout_banner"]) });
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(screen.getByText("|false")).toBeTruthy();
  });
});
