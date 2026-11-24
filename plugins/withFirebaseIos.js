const path = require("path");

// React Native Firebase's own config plugin fails the prebuild when either platform has no Firebase
// file, and its FirebaseApp.configure() crashes an iOS app built without GoogleService-Info.plist.
// This applies only its iOS part, and only when ios.googleServicesFile is set (from
// GOOGLE_SERVICE_INFO_PLIST). A build without the file has no native Firebase app, so Remote Config
// answers nothing and the flags keep their defaults.
// Android needs nothing from it: Expo already applies the google-services Gradle plugin when
// android.googleServicesFile is set, and React Native Firebase starts from that.
// The package doesn't export its plugin's iOS mods, so they're loaded by path.
const rnfbIos = require(
  path.join(path.dirname(require.resolve("@react-native-firebase/app/package.json")), "plugin/build/ios"),
);

module.exports = (config) => {
  if (!config.ios?.googleServicesFile) {
    return config;
  }
  config = rnfbIos.withIosGoogleServicesFile(config);
  config = rnfbIos.withFirebaseAppDelegate(config);
  return rnfbIos.withIosDisableSPM(config, {});
};
