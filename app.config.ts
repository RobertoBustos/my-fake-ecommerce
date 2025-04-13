import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME || "MyApp",
  slug: "my-fake-ecommerce",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.UNIQUE_IDENTIFIER,
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false
    },
    icon: {
      dark: "./assets/icons/ios-dark.png",
      light: "./assets/icons/ios-light.png",
      tinted: "./assets/icons/ios-tinted.png"
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      monochromeImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: process.env.UNIQUE_IDENTIFIER
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/icons/splash-icon-dark.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/icons/splash-icon-light.png",
          backgroundColor: "#000000",
        }
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "83be7d54-e5d5-43d8-b734-91a1c965d45f"
    }
  },
  owner: "robertobustos"
})