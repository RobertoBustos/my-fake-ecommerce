import { ConfigContext, ExpoConfig } from "expo/config";

const getAppName = (): string => {
  if (!process.env.APP_NAME) {
    throw new Error("APP_NAME is not set. Copy .env.example to .env.local and fill it in.");
  }
  return process.env.APP_NAME;
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "my-fake-ecommerce",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
    },
    supportsTablet: true,
    bundleIdentifier: process.env.UNIQUE_IDENTIFIER,
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
      "NSLocationWhenInUseUsageDescription": "We use your location to display your current position on the map",
      "NSLocationAlwaysAndWhenInUseUsageDescription": "We use your location to display your current position on the map",
      "NSCameraUsageDescription": "Allow $(PRODUCT_NAME) to access your camera."
    },
    icon: {
      dark: "./assets/icons/ios-dark.png",
      light: "./assets/icons/ios-light.png",
      tinted: "./assets/icons/ios-tinted.png"
    }
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    },
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      monochromeImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: process.env.UNIQUE_IDENTIFIER,
    permissions: ["CAMERA", "ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION", "ACCESS_BACKGROUND_LOCATION"]
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    "./plugins/withIosMinimumDeploymentTarget",
    "./plugins/withFmtCxx17",
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