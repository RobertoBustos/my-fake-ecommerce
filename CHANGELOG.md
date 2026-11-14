# Changelog

All notable changes to this project are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Anonymous Firebase sessions: the app opens without an account, and an account
  is optional. Creating one keeps the cart.
- A CI workflow, `CLAUDE.md` and this changelog.

### Changed

- The app points at the production API through environment configuration.
- The API URL, the Firebase settings and the app name always come from the
  environment file; there are no fallback values in the code.
- The Xcode 27 deployment target fix lives in a config plugin.
- Expo SDK 53: React Native 0.79, React 19 and Stripe 0.45. ESLint uses the
  flat configuration in `eslint.config.js`.
- Expo SDK 54: React Native 0.81, React 19.1, Reanimated 4 and Stripe 0.50.
  Android draws edge-to-edge, so the status bar takes the window's color
  instead of the header's.
- Expo SDK 55: React Native 0.83, React 19.2 and Stripe 0.63. The New
  Architecture is the only one, so `newArchEnabled` is gone from the config.
  Stripe 0.63 fixes the iOS header that `patch-package` used to patch, so the
  patch and `patch-package` are removed. The app now needs iOS 16.4, because
  expo-router 55 uses iOS 16 APIs. The Google Maps key goes through the
  `react-native-maps` config plugin, which replaced the old Google Maps pod.
  On Android the header pads itself below the status bar, which is navy again,
  and screens keep their content above the navigation bar.

### Fixed

- A product without an image no longer opens a "Cannot load an empty url"
  alert at the end of the catalog. Images that fail to load keep a placeholder
  instead of showing an alert.
- The address screen enables "Continue" only after the map has finished moving
  to the address, so the user sees it before confirming.
- On iOS, "Continue" on the address screen no longer stays disabled when the
  map misses its camera event: the map checks its camera until it rests on the
  address, and animates again if it never gets there.
- The address screen no longer opens an alert, technical or empty, when the
  current location or its address can't be found: the field stays empty to
  type the address. The location request gives up after 10 seconds.

### Removed

- `ios/` and `android/` are no longer tracked. `npx expo prebuild` generates
  them.
- The app no longer asks for background ("always") location, camera on
  Android, storage or screen overlay permissions. It only uses the location
  while it is open, to prefill the delivery address.

### Security

- A Google Maps key committed to the native folders was deleted from Google
  Cloud and replaced by a restricted key that only lives in the environment.
