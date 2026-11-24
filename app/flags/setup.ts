import { FirstMatchStrategy, MultiProvider, OpenFeature, type Provider } from "@openfeature/web-sdk";
import { type FlagOverrides, BuildOverrideProvider, readBuildOverrides } from "./providers/buildOverride";
import { RemoteConfigProvider } from "./providers/remoteConfig";
import type { FlagOwner } from "./registry";

const DOMAINS: FlagOwner[] = ["release", "ops"];

const remoteProviders = (domain: FlagOwner): Provider[] => (domain === "ops" ? [new RemoteConfigProvider()] : []);

// One OpenFeature domain per tool. In each, the providers answer in order and the first one that
// knows the flag wins: the build overrides, then the domain's tool ("ops": Remote Config). GrowthBook
// joins "release" later. The app doesn't wait for the returned promise: until a domain is ready, its
// flags read their default. It never rejects
export const setupFlags = (overrides: FlagOverrides = readBuildOverrides()): Promise<void> =>
  Promise.all(
    DOMAINS.map((domain) => {
      const providers = [new BuildOverrideProvider(overrides), ...remoteProviders(domain)].map((provider) => ({
        name: provider.metadata.name,
        provider,
      }));
      return OpenFeature.setProviderAndWait(domain, new MultiProvider(providers, new FirstMatchStrategy())).catch(
        (error) => console.warn(`Could not start the "${domain}" flag providers`, error),
      );
    }),
  ).then(() => undefined);
