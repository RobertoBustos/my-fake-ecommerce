// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // eslint-plugin-react can't detect the React version on ESLint 10
    settings: { react: { version: "19.3" } },
  },
  {
    // Screens read flags through app/flags (useFlag, flagValue), which is the only place that
    // knows which tool answers each one
    ignores: ["app/flags/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@openfeature/*", "@growthbook/*", "@react-native-firebase/remote-config"],
              message: "Read feature flags through app/flags (useFlag or flagValue).",
            },
          ],
        },
      ],
    },
  },
]);
