export const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const MERCHANT_ID = process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://my-fake-ecommerce-150b2.web.app/graphql"
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

export const FIREBASE_CONFIG = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "my-fake-ecommerce-150b2.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "my-fake-ecommerce-150b2",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

export default {}
