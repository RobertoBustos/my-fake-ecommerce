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
  version: "1.3.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.UNIQUE_IDENTIFIER,
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
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
    // FCM delivers the push notifications. The file is only set when the variable is, so a build
    // without it, like the one the e2e-android check makes, still compiles
    ...(process.env.GOOGLE_SERVICES_JSON && { googleServicesFile: process.env.GOOGLE_SERVICES_JSON }),
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
    output: "single",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          // The minimum since Expo SDK 56
          deploymentTarget: "16.4",
          // Stripe 0.78+ gets its iOS SDK through Swift Package Manager, which needs dynamic frameworks
          useFrameworks: "dynamic",
        },
        android: {
          // R8 strips the Room database that WorkManager (from react-native-maps) creates by
          // name, and the app crashes at launch
          extraProguardRules: "-keep class * extends androidx.room.RoomDatabase { <init>(); }",
        },
      },
    ],
    // The location is only read while the app is open, to prefill the delivery address. Setting
    // a permission to false keeps the plugin from adding its default text for it
    [
      "expo-location",
      {
        locationWhenInUsePermission: "We use your location to prefill your delivery address and show it on the map",
        locationAlwaysAndWhenInUsePermission: false,
        locationAlwaysPermission: false,
        locationFullAccuracyPermission: false,
        motionUsagePermission: false,
      },
    ],
    // Adds the iOS push entitlement and the Android notification icon. The app creates the orders
    // channel; until it does, Android shows the notifications in a fallback channel
    [
      "expo-notifications",
      {
        icon: "./assets/icons/notification-icon.png",
        color: "#000040",
        defaultChannel: "orders",
      },
    ],
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
  extra: {
    eas: {
      projectId: "83be7d54-e5d5-43d8-b734-91a1c965d45f"
    }
  },
  owner: "robertobustos"
})