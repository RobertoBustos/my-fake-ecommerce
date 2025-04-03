import { Platform } from "react-native"

export const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const MERCHANT_ID = process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID
export const BASE_URL = Platform.OS === "ios" ? process.env.EXPO_PUBLIC_BASE_URL_IOS : process.env.EXPO_PUBLIC_BASE_URL_ANDROID
export const PORT = process.env.EXPO_PUBLIC_PORT

export default {}