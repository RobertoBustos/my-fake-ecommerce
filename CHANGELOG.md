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

### Fixed

- A product without an image no longer opens a "Cannot load an empty url"
  alert at the end of the catalog. Images that fail to load keep a placeholder
  instead of showing an alert.
- The address screen enables "Continue" only after the map has finished moving
  to the address, so the user sees it before confirming.

### Removed

- `ios/` and `android/` are no longer tracked. `npx expo prebuild` generates
  them.

### Security

- A Google Maps key committed to the native folders was deleted from Google
  Cloud and replaced by a restricted key that only lives in the environment.
