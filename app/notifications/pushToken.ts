import Constants from "expo-constants";
import {
  DevicePushToken,
  getDevicePushTokenAsync,
  getExpoPushTokenAsync,
  getPermissionsAsync,
} from "expo-notifications";
import { Platform } from "react-native";
import { MutationResponseType } from "../constants/types";
import gqlClient from "../graphql/gqlClient";
import { REGISTER_PUSH_TOKEN, UNREGISTER_PUSH_TOKEN } from "../graphql/mutations";
import { UnsuccessfulMutationError } from "../utils/apiErrors";
import { auth } from "../utils/firebase";

// The token registered for the current session, so signing out can delete it
let registeredToken: string | undefined;
// The device token (APNs or FCM) behind the Expo token. Fetching it also fires the token
// listener with the same value, so the listener compares against this to avoid a loop
let currentDeviceToken: string | undefined;

const getPushToken = async () => {
  const devicePushToken = await getDevicePushTokenAsync();
  currentDeviceToken = String(devicePushToken.data);
  const { data } = await getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
    devicePushToken,
  });
  return data;
};

// Ties this phone's token to the user with the session. The API moves a token that belonged
// to another uid, so this runs at every startup, on every new uid and when the token changes.
// A failure is only logged: the next startup tries again
export const syncPushToken = async () => {
  try {
    if (!auth.currentUser) return;
    const { granted } = await getPermissionsAsync();
    if (!granted) return;
    const token = await getPushToken();
    const { data } = await gqlClient.mutate<{ registerPushToken: MutationResponseType }>({
      mutation: REGISTER_PUSH_TOKEN,
      variables: { input: { token, platform: Platform.OS === "ios" ? "IOS" : "ANDROID" } },
    });
    // It can answer success: false without a GraphQL error
    if (!data?.registerPushToken.success) {
      throw new UnsuccessfulMutationError(data?.registerPushToken.message);
    }
    registeredToken = token;
  } catch (error) {
    console.warn("Could not register the push token", error);
  }
};

// Runs before signing out, while the Firebase ID token is still valid. Signing out goes on
// even if this fails: the API moves the token to whoever signs in next on this phone
export const unregisterPushToken = async () => {
  const token = registeredToken;
  if (!token) return;
  registeredToken = undefined;
  try {
    await gqlClient.mutate({ mutation: UNREGISTER_PUSH_TOKEN, variables: { input: { token } } });
  } catch (error) {
    console.warn("Could not delete the push token", error);
  }
};

// The token listener. It also fires every time syncPushToken fetches the token, so only a
// device token different from the last one fetched is synced again
export const onDevicePushTokenChange = ({ data }: DevicePushToken) => {
  const deviceToken = String(data);
  if (deviceToken === currentDeviceToken) return;
  currentDeviceToken = deviceToken;
  syncPushToken();
};
