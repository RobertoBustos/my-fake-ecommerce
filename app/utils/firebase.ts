import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
// @ts-ignore: only exported by the react-native build of firebase/auth, which TypeScript does not resolve
import { getReactNativePersistence } from "firebase/auth";
import { FIREBASE_CONFIG } from "../constants/config";

const createAuth = (): Auth => {
    if (getApps().length) {
        return getAuth(getApp())
    }
    const app = initializeApp(FIREBASE_CONFIG)
    // Keeps the session between app launches
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
}

export const auth = createAuth()

export default {}
