import {
  ErrorCode,
  type JsonValue,
  OpenFeatureEventEmitter,
  type Provider,
  ProviderEvents,
  type ResolutionDetails,
  StandardResolutionReasons,
} from "@openfeature/web-sdk";
import { getApps } from "@react-native-firebase/app";
import {
  activate,
  fetchConfig,
  getRemoteConfig,
  getValue,
  onConfigUpdate,
} from "@react-native-firebase/remote-config";

type RemoteConfig = ReturnType<typeof getRemoteConfig>;

// Remote Config keeps every value as a string. These are the ones it reads as a boolean
const TRUE_VALUES = new Set(["1", "true", "t", "yes", "y", "on"]);
const FALSE_VALUES = new Set(["0", "false", "f", "no", "n", "off", ""]);

const parseBoolean = (raw: string): boolean | undefined => {
  const value = raw.trim().toLowerCase();
  if (TRUE_VALUES.has(value)) return true;
  if (FALSE_VALUES.has(value)) return false;
  return undefined;
};

const parseNumber = (raw: string): number | undefined => {
  const value = raw.trim() === "" ? NaN : Number(raw);
  return Number.isFinite(value) ? value : undefined;
};

// Firebase Remote Config, through React Native Firebase, for the ops domain. Launch never waits for
// the network: it activates what the previous session downloaded and fetches in the background for
// the next launch. A real-time update is activated at once, so a kill switch applies in seconds.
// Without a native Firebase app (a build without the Firebase file), it answers no flag
export class RemoteConfigProvider implements Provider {
  readonly metadata = { name: "remote-config" } as const;
  readonly runsOn = "client";
  readonly events = new OpenFeatureEventEmitter();

  private remoteConfig: RemoteConfig | undefined;
  private unsubscribe: (() => void) | undefined;

  async initialize(): Promise<void> {
    // Never rejects: a failure here leaves the domain on build overrides and defaults
    try {
      if (getApps().length === 0) {
        console.warn("Remote Config is off: this build has no native Firebase app");
        return;
      }
      const remoteConfig = getRemoteConfig();
      await activate(remoteConfig);
      this.remoteConfig = remoteConfig;
    } catch (error) {
      console.warn("Could not activate Remote Config; ops flags use their defaults", error);
      return;
    }
    const remoteConfig = this.remoteConfig;
    fetchConfig(remoteConfig).catch((error) => {
      console.warn("Could not fetch Remote Config for the next launch", error);
    });
    this.unsubscribe = onConfigUpdate(remoteConfig, {
      next: (update) => {
        activate(remoteConfig)
          .then(() => {
            this.events.emit(ProviderEvents.ConfigurationChanged, { flagsChanged: [...update.getUpdatedKeys()] });
          })
          .catch((error) => console.warn("Could not activate a Remote Config update", error));
      },
      // Firebase retries on its own; the next launch also activates whatever was fetched
      error: (error) => console.warn("Remote Config real-time updates stopped", error),
      complete: () => undefined,
    });
  }

  async onClose(): Promise<void> {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  resolveBooleanEvaluation(flagKey: string, defaultValue: boolean): ResolutionDetails<boolean> {
    return this.resolve(flagKey, defaultValue, parseBoolean);
  }

  resolveNumberEvaluation(flagKey: string, defaultValue: number): ResolutionDetails<number> {
    return this.resolve(flagKey, defaultValue, parseNumber);
  }

  resolveStringEvaluation(flagKey: string, defaultValue: string): ResolutionDetails<string> {
    return this.resolve(flagKey, defaultValue, (raw) => raw);
  }

  resolveObjectEvaluation<T extends JsonValue>(flagKey: string, defaultValue: T): ResolutionDetails<T> {
    return this.resolve(flagKey, defaultValue, (raw) => {
      try {
        const value: unknown = JSON.parse(raw);
        return typeof value === "object" && value !== null ? (value as T) : undefined;
      } catch {
        return undefined;
      }
    });
  }

  private resolve<T>(flagKey: string, defaultValue: T, parse: (raw: string) => T | undefined): ResolutionDetails<T> {
    const value = this.remoteConfig && getValue(this.remoteConfig, flagKey);
    // "static": the console has no value for the key and the app sets no in-app default
    if (!value || value.getSource() === "static") {
      return { value: defaultValue, reason: StandardResolutionReasons.ERROR, errorCode: ErrorCode.FLAG_NOT_FOUND };
    }
    const parsed = parse(value.asString());
    if (parsed === undefined) {
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.ERROR,
        errorCode: ErrorCode.TYPE_MISMATCH,
        errorMessage: `Remote Config has "${value.asString()}" for "${flagKey}"`,
      };
    }
    return { value: parsed, reason: StandardResolutionReasons.CACHED };
  }
}
