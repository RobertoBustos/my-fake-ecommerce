const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Apollo Client 4 ships a FinalizationRegistry ponyfill for React Native only behind the
// "react-native" condition of its package exports, which this Metro does not read by default.
// Without it Apollo uses the global one, which Hermes lacks, and the app crashes at launch.
const APOLLO_PONYFILLS = "@apollo/client/utilities/internal/ponyfills";
const apolloPonyfillsForReactNative = path.join(
  path.dirname(require.resolve("@apollo/client/package.json")),
  "utilities/internal/ponyfills/index.react-native.js"
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === APOLLO_PONYFILLS) {
    return { type: "sourceFile", filePath: apolloPonyfillsForReactNative };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
