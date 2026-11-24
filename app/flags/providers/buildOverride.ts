import {
  ErrorCode,
  type JsonValue,
  type Provider,
  type ResolutionDetails,
  StandardResolutionReasons,
} from "@openfeature/web-sdk";
import Constants from "expo-constants";

export type FlagOverrides = Record<string, unknown>;

// app.config.ts copies the FLAG_OVERRIDES variable (a JSON object) into extra.flags. Only test
// builds set it, to pin flags to known values
export const readBuildOverrides = (): FlagOverrides => {
  const overrides: unknown = Constants.expoConfig?.extra?.flags;
  if (typeof overrides !== "object" || overrides === null || Array.isArray(overrides)) {
    return {};
  }
  return overrides as FlagOverrides;
};

// Answers first in every domain. A flag without an override gets FLAG_NOT_FOUND, so the next
// provider answers it
export class BuildOverrideProvider implements Provider {
  readonly metadata = { name: "build-override" } as const;
  readonly runsOn = "client";

  constructor(private readonly overrides: FlagOverrides) {}

  resolveBooleanEvaluation(flagKey: string, defaultValue: boolean): ResolutionDetails<boolean> {
    return this.resolve(flagKey, defaultValue, (value) => typeof value === "boolean");
  }

  resolveNumberEvaluation(flagKey: string, defaultValue: number): ResolutionDetails<number> {
    return this.resolve(flagKey, defaultValue, (value) => typeof value === "number");
  }

  resolveStringEvaluation(flagKey: string, defaultValue: string): ResolutionDetails<string> {
    return this.resolve(flagKey, defaultValue, (value) => typeof value === "string");
  }

  resolveObjectEvaluation<T extends JsonValue>(flagKey: string, defaultValue: T): ResolutionDetails<T> {
    return this.resolve(flagKey, defaultValue, (value) => typeof value === "object" && value !== null);
  }

  private resolve<T>(flagKey: string, defaultValue: T, isType: (value: unknown) => boolean): ResolutionDetails<T> {
    if (!Object.hasOwn(this.overrides, flagKey)) {
      return { value: defaultValue, reason: StandardResolutionReasons.ERROR, errorCode: ErrorCode.FLAG_NOT_FOUND };
    }
    const value = this.overrides[flagKey];
    // A wrong type is an error, not a miss: the flag falls back to its default instead of
    // silently taking a remote value the test build meant to pin
    if (!isType(value)) {
      return {
        value: defaultValue,
        reason: StandardResolutionReasons.ERROR,
        errorCode: ErrorCode.TYPE_MISMATCH,
        errorMessage: `FLAG_OVERRIDES has a ${typeof value} for "${flagKey}"`,
      };
    }
    return { value: value as T, reason: StandardResolutionReasons.STATIC, variant: "override" };
  }
}
