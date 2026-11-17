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
- Expo SDK 56: React Native 0.85, TypeScript 6 and Unistyles 3. Style sheets
  use `StyleSheet.create` and components read the theme with `useUnistyles`.
  React Navigation comes from expo-router, which bundles its own copy, so the
  `@react-navigation/*` packages are no longer dependencies. A patch to
  Reanimated 4.3.1 guards against a startup race that crashed the app on iOS
  (react-native-reanimated#10135, fixed upstream in 4.5.4).
- Expo SDK 57: React Native 0.86 and Reanimated 4.5, which fixes the Hermes V1
  memory regression. The app adopts the iOS scene lifecycle, so it launches on
  iOS 27. Reanimated 4.5.1 still needs the startup patch.
- Expo SDK 58: React Native 0.88, React 19.3, Reanimated 4.7, Stripe 0.81 and
  Jest 30. The scene lifecycle comes with the template, and Reanimated 4.7
  includes the startup fix, so the patch and `patch-package` are removed again.
  Android release builds are shrunk with R8, with a keep rule for the Room
  database of WorkManager. react-native-root-toast moves to 4.0.
- The app no longer uses expo-router. It was only the entry point, and
  expo-router 58 can't host a navigator built by hand inside a route. `index.ts`
  registers the app, which wraps its React Navigation stack in a
  `NavigationContainer` and a `SafeAreaProvider`. Without expo-router iOS also
  draws edge-to-edge: the header pads itself below the status bar, which is
  navy with light text on both platforms, and screens stay above the home
  indicator.
  Stripe is on 0.82.0 instead of the 0.81.0 that Expo recommends, because
  0.81.0 breaks Android release builds on AGP 9; `expo.install.exclude` lets
  `expo install --check` accept it. iOS pods build as dynamic frameworks,
  which Stripe's Swift Package Manager setup requires.
- Node 24, locally (`.nvmrc`) and in CI, because firebase 13 requires it.
- The libraries that Expo doesn't pin move to their latest versions: firebase
  13, graphql 17, ESLint 10, uuid 14, react-native-get-random-values 2, Redux
  Toolkit 2.14, Reactotron 5.3 and React Native Testing Library 14, whose
  `render` and `renderHook` are awaited in the tests. eslint-plugin-react
  can't detect the React version on ESLint 10, so `eslint.config.js` sets it.
  Jest loads immer, which Redux Toolkit uses, from its CommonJS build. TypeScript
  stays on 6.
- The current location comes from expo-location instead of
  `@react-native-community/geolocation`, which is no longer maintained. The
  app asks for the location only while it is open, and the address field still
  stays empty, without alerts, when the permission is denied or the location
  doesn't arrive within 10 seconds.

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
- `react-test-renderer`, replaced by `test-renderer` in Testing Library 14, and
  `@react-native-community/cli`, which nothing used.

### Security

- A Google Maps key committed to the native folders was deleted from Google
  Cloud and replaced by a restricted key that only lives in the environment.
