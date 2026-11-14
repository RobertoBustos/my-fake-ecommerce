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
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.UNIQUE_IDENTIFIER,
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
      // The location is only read while the app is open, to prefill the delivery address
      "NSLocationWhenInUseUsageDescription": "We use your location to prefill your delivery address and show it on the map",
      // Stripe's Payment Sheet offers card scanning only when this is set
      "NSCameraUsageDescription": "Allow $(PRODUCT_NAME) to access your camera."
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
    package: process.env.UNIQUE_IDENTIFIER,
    permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    // The template and libraries can add these back; nothing in the app needs them
    blockedPermissions: [
      "android.permission.ACCESS_BACKGROUND_LOCATION",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.SYSTEM_ALERT_WINDOW"
    ]
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    // expo-router 55 uses iOS 16 APIs without an availability check
    ["expo-build-properties", { ios: { deploymentTarget: "16.4" } }],
    "./plugins/withIosMinimumDeploymentTarget",
    "./plugins/withFmtCxx17",
    // react-native-maps 1.21+ replaced the pod that ios.config.googleMapsApiKey adds
    [
      "react-native-maps",
      {
        iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    ],
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