export const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const MERCHANT_ID = process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID
export const API_URL = process.env.EXPO_PUBLIC_API_URL
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

export const FIREBASE_CONFIG = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

// Cloud Run scales to zero: the first request after a while can take a few seconds more
export const REQUEST_TIMEOUT_MS = 15000
// The Stripe webhook completes the order (about 3 s in production)
export const PAYMENT_POLL_INTERVAL_MS = 1500
export const PAYMENT_POLL_TIMEOUT_MS = 30000

export default {}
