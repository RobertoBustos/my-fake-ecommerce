import { GrowthBook, configureCache, setPolyfills } from "@growthbook/growthbook";
import {
  ErrorCode,
  type EvaluationContext,
  type JsonValue,
  OpenFeatureEventEmitter,
  type Provider,
  ProviderEvents,
  type ResolutionDetails,
  StandardResolutionReasons,
} from "@openfeature/web-sdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, type NativeEventSubscription } from "react-native";

const API_HOST = "https://cdn.growthbook.io";
// The app downloads features at most once every 15 minutes: at launch and on returning to the
// foreground, only when the cached copy is older than this
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
// How long launch waits for the first download when there's no cached copy yet
const FIRST_FETCH_TIMEOUT_MS = 3000;

let cacheConfigured = false;

// GrowthBook keeps its cached payload in localStorage, which React Native doesn't have
const configureGrowthBookCache = () => {
  if (cacheConfigured) return;
  cacheConfigured = true;
  setPolyfills({
    localStorage: {
      getItem: (key: string) => AsyncStorage.getItem(key),
      setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
    },
  });
  configureCache({ staleTTL: REFRESH_INTERVAL_MS, backgroundSync: false });
};

// GrowthBook splits rollouts by the `id` attribute and doesn't read OpenFeature's targetingKey
const toAttributes = ({ targetingKey, ...rest }: EvaluationContext): Record<string, unknown> => ({
  ...rest,
  id: rest.id ?? targetingKey,
});

const REASONS: Record<string, string> = {
  experiment: StandardResolutionReasons.SPLIT,
  force: StandardResolutionReasons.TARGETING_MATCH,
  defaultValue: StandardResolutionReasons.DEFAULT,
  override: StandardResolutionReasons.STATIC,
};

// GrowthBook, for the release domain. Launch uses the cached payload from the previous session and
// downloads a newer one in the background; with no cache yet it waits a few seconds for the first
// download. A new payload changes what flagValue returns, but useFlag keeps release flags at the
// value they had when the screen mounted, so they apply on the next screen or launch.
// Without a client key it answers no flag
export class GrowthBookProvider implements Provider {
  readonly metadata = { name: "growthbook" } as const;
  readonly runsOn = "client";
  readonly events = new OpenFeatureEventEmitter();

  private growthbook: GrowthBook | undefined;
  private appStateSubscription: NativeEventSubscription | undefined;

  constructor(private readonly clientKey: string | undefined) {}

  async initialize(context: EvaluationContext = {}): Promise<void> {
    // Never rejects: a failure leaves the domain on build overrides and defaults
    if (!this.clientKey) {
      console.warn("GrowthBook is off: EXPO_PUBLIC_GROWTHBOOK_CLIENT_KEY is not set");
      return;
    }
    configureGrowthBookCache();
    const growthbook = new GrowthBook({ apiHost: API_HOST, clientKey: this.clientKey, attributes: toAttributes(context) });
    try {
      const result = await growthbook.init({ timeout: FIRST_FETCH_TIMEOUT_MS, streaming: false });
      if (!result.success) {
        console.warn("GrowthBook has no features yet; release flags use their defaults", result.error);
      }
    } catch (error) {
      console.warn("Could not start GrowthBook; release flags use their defaults", error);
    }
    this.growthbook = growthbook;
    this.appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") this.refresh();
    });
  }

  async onClose(): Promise<void> {
    this.appStateSubscription?.remove();
    this.growthbook?.destroy();
    this.growthbook = undefined;
  }

  async onContextChange(_oldContext: EvaluationContext, newContext: EvaluationContext): Promise<void> {
    await this.growthbook?.setAttributes(toAttributes(newContext));
  }

  // Uses the cache while it's fresh, so a foreground refresh downloads at most every 15 minutes
  private refresh() {
    this.growthbook
      ?.refreshFeatures()
      .then(() => this.events.emit(ProviderEvents.ConfigurationChanged))
      .catch((error) => console.warn("Could not refresh GrowthBook features", error));
  }

  resolveBooleanEvaluation(flagKey: string, defaultValue: boolean): ResolutionDetails<boolean> {
    return this.resolve(flagKey, defaultValue);
  }

  resolveNumberEvaluation(flagKey: string, defaultValue: number): ResolutionDetails<number> {
    return this.resolve(flagKey, defaultValue);
  }

  resolveStringEvaluation(flagKey: string, defaultValue: string): ResolutionDetails<string> {
    return this.resolve(flagKey, defaultValue);
  }

  resolveObjectEvaluation<T extends JsonValue>(flagKey: string, defaultValue: T): ResolutionDetails<T> {
    return this.resolve(flagKey, defaultValue);
  }

  private resolve<T>(flagKey: string, defaultValue: T): ResolutionDetails<T> {
    const result = this.growthbook?.evalFeature(flagKey);
    if (!result || result.source === "unknownFeature" || result.value === null) {
      return { value: defaultValue, reason: StandardResolutionReasons.ERROR, errorCode: ErrorCode.FLAG_NOT_FOUND };
    }
    if (typeof result.value !== typeof defaultValue) {
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.ERROR,
        errorCode: ErrorCode.TYPE_MISMATCH,
        errorMessage: `GrowthBook has a ${typeof result.value} for "${flagKey}"`,
      };
    }
    return {
      value: result.value as T,
      reason: REASONS[result.source] ?? StandardResolutionReasons.UNKNOWN,
      variant: result.experimentResult?.key,
    };
  }
}
