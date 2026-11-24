import { InMemoryProvider, OpenFeature } from "@openfeature/web-sdk";
import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { defineFlag, flags as registry } from "../registry";
import { flagValue, setupFlags, useFlag } from "..";

jest.mock("expo-constants", () => ({ expoConfig: { extra: {} } }));

const newCheckout = defineFlag({
  key: "new-checkout",
  owner: "release",
  default: false,
  description: "Test release flag",
  responsible: "mobile",
  removeBy: "2026-12-31",
});
const maxItems = defineFlag({ key: "max-items", owner: "ops", default: 10, description: "Test ops flag" });

const FlagText = () => {
  const banner = useFlag(registry.checkoutBanner);
  const enabled = useFlag(newCheckout);
  return <Text>{`${banner}|${enabled}`}</Text>;
};

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
    await setupFlags({ "checkout-banner": "Free shipping", "new-checkout": true, "max-items": 3 });
    expect(flagValue(registry.checkoutBanner)).toBe("Free shipping");
    expect(flagValue(newCheckout)).toBe(true);
    expect(flagValue(maxItems)).toBe(3);
  });

  it("keeps the default when an override has the wrong type", async () => {
    await setupFlags({ "new-checkout": "yes" });
    expect(flagValue(newCheckout)).toBe(false);
  });

  it("asks each flag's own domain", async () => {
    await OpenFeature.setProviderAndWait(
      "release",
      new InMemoryProvider({ "max-items": { variants: { low: 1 }, defaultVariant: "low", disabled: false } }),
    );
    // The release domain knows max-items, but the flag is an ops flag
    expect(flagValue(maxItems)).toBe(10);
  });

  it("renders the value in a component and re-renders when it changes", async () => {
    const release = new InMemoryProvider({
      "new-checkout": { variants: { on: true, off: false }, defaultVariant: "off", disabled: false },
    });
    const ops = new InMemoryProvider({
      "checkout-banner": { variants: { sale: "Sale" }, defaultVariant: "sale", disabled: false },
    });
    await OpenFeature.setProviderAndWait("release", release);
    await OpenFeature.setProviderAndWait("ops", ops);

    await render(<FlagText />);
    expect(screen.getByText("Sale|false")).toBeTruthy();

    await act(() =>
      release.putConfiguration({
        "new-checkout": { variants: { on: true, off: false }, defaultVariant: "on", disabled: false },
      }),
    );
    expect(screen.getByText("Sale|true")).toBeTruthy();
  });

  it("renders the default until the providers are ready, then the override", async () => {
    await render(<FlagText />);
    expect(screen.getByText("|false")).toBeTruthy();

    await act(async () => {
      await setupFlags({ "checkout-banner": "Free shipping" });
    });
    expect(screen.getByText("Free shipping|false")).toBeTruthy();
  });
});
