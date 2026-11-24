// Every flag the app reads is declared here, once. The default is the current, tested behavior:
// a build with no network and no cached values runs on defaults alone, so a default must never
// turn on something unfinished.

export type FlagType = boolean | number | string;

// Which tool answers the flag. A flag lives in exactly one tool
// - "release": GrowthBook, for release flags with gradual rollouts and experiments
// - "ops": Firebase Remote Config, for kill switches and operational settings
export type FlagOwner = "release" | "ops";

type BaseFlag<T extends FlagType> = {
  // snake_case: Remote Config only accepts letters, digits and underscores, and GrowthBook uses the
  // same rule so both tools name flags alike. The API uses the same key for a flag both read
  key: string;
  default: T;
  description: string;
};

// Kill switches and settings stay as long as the feature they control
export type OpsFlag<T extends FlagType> = BaseFlag<T> & { owner: "ops" };

// Release flags are temporary: someone owns removing them, by a date (YYYY-MM-DD)
export type ReleaseFlag<T extends FlagType> = BaseFlag<T> & {
  owner: "release";
  responsible: string;
  removeBy: string;
};

export type FlagDefinition<T extends FlagType = FlagType> = OpsFlag<T> | ReleaseFlag<T>;

// Widens the default's literal type, so `default: ""` declares a string flag and not one whose
// only valid value is ""
type Widen<T> = T extends boolean ? boolean : T extends number ? number : T extends string ? string : never;

export const FLAG_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;

export const defineFlag = <T extends FlagType>(flag: FlagDefinition<T>): FlagDefinition<Widen<T>> =>
  flag as unknown as FlagDefinition<Widen<T>>;

export const flags = {
  // Text of an announcement banner on the checkout screen; empty shows no banner. The API reads
  // the same key from the same tool
  checkoutBanner: defineFlag({
    key: "checkout_banner",
    owner: "ops",
    default: "",
    description: "Announcement shown on the checkout screen. Empty: no banner.",
  }),
};
