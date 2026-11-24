import { FirstMatchStrategy, MultiProvider, OpenFeature } from "@openfeature/web-sdk";
import { type FlagOverrides, BuildOverrideProvider, readBuildOverrides } from "./providers/buildOverride";
import type { FlagOwner } from "./registry";

const DOMAINS: FlagOwner[] = ["release", "ops"];

// One OpenFeature domain per tool. In each, the providers answer in order and the first one that
// knows the flag wins. For now only the build overrides; GrowthBook joins "release" and Remote
// Config joins "ops". The app doesn't wait for the returned promise: until a domain is ready, its
// flags read their default. It never rejects
export const setupFlags = (overrides: FlagOverrides = readBuildOverrides()): Promise<void> =>
  Promise.all(
    DOMAINS.map((domain) => {
      const providers = [{ name: "build-override", provider: new BuildOverrideProvider(overrides) }];
      return OpenFeature.setProviderAndWait(domain, new MultiProvider(providers, new FirstMatchStrategy())).catch(
        (error) => console.warn(`Could not start the "${domain}" flag providers`, error),
      );
    }),
  ).then(() => undefined);
