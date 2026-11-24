// Everything about feature flags lives in this folder: the rest of the app reads them only through
// useFlag and flagValue, and never imports a flag SDK (ESLint enforces it)
import { type Client, OpenFeature, ProviderEvents } from "@openfeature/web-sdk";
import { useEffect, useState } from "react";
import type { FlagDefinition, FlagType } from "./registry";

export { flags } from "./registry";
export type { FlagDefinition } from "./registry";
export { setupFlags } from "./setup";

// Clients find their domain's provider when they evaluate, so they can exist before setupFlags runs
const clients: Record<FlagDefinition["owner"], Client> = {
  release: OpenFeature.getClient("release"),
  ops: OpenFeature.getClient("ops"),
};

const evaluate = <T extends FlagType>(client: Client, flag: FlagDefinition<T>): T => {
  // The registry types each flag by its default, so the value has the same type
  switch (typeof flag.default) {
    case "boolean":
      return client.getBooleanValue(flag.key, flag.default as boolean) as T;
    case "number":
      return client.getNumberValue(flag.key, flag.default as number) as T;
    default:
      return client.getStringValue(flag.key, flag.default as string) as T;
  }
};

// The flag's value now, for code outside React. It doesn't follow later changes
export const flagValue = <T extends FlagType>(flag: FlagDefinition<T>): T =>
  evaluate(clients[flag.owner], flag);

// Events after which a flag can have a different value. Release flags only take the value their
// provider has once it's ready: a newer GrowthBook payload applies on the next screen or launch,
// never on a screen that's open. Ops flags (kill switches) follow every change at once
const CHANGE_EVENTS: Record<FlagDefinition["owner"], ProviderEvents[]> = {
  release: [ProviderEvents.Ready],
  ops: [ProviderEvents.Ready, ProviderEvents.ConfigurationChanged, ProviderEvents.ContextChanged],
};

// The flag's value in a component. It reads its domain's client directly, because OpenFeature's
// React SDK binds every hook to a single domain
export const useFlag = <T extends FlagType>(flag: FlagDefinition<T>): T => {
  const [value, setValue] = useState(() => flagValue(flag));

  // Flags are module constants from the registry, so `flag` keeps its identity between renders
  useEffect(() => {
    const client = clients[flag.owner];
    const update = () => setValue(flagValue(flag));
    const events = CHANGE_EVENTS[flag.owner];
    events.forEach((event) => client.addHandler(event, update));
    // The provider may have become ready between the first render and this effect
    update();
    return () => events.forEach((event) => client.removeHandler(event, update));
  }, [flag]);

  return value;
};
