# My Fake Ecommerce

React Native (Expo) store app. It talks to the [my-fake-ecommerce-api](https://github.com/RobertoBustos/my-fake-ecommerce-api) GraphQL API and signs users in with Firebase Auth.

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Create your environment file and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Where it comes from | Required |
   | --- | --- | --- |
   | `APP_NAME` | The app's display name; falls back to `MyApp` | No |
   | `UNIQUE_IDENTIFIER` | iOS bundle identifier and Android package | For native builds |
   | `EXPO_PUBLIC_API_URL` | GraphQL endpoint, production or local | Yes |
   | `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_APP_ID`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase console > Project settings > Your apps | Yes |
   | `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard, test mode (`pk_test_...`) | Yes |
   | `EXPO_PUBLIC_STRIPE_MERCHANT_ID` | Apple Pay merchant id | For Apple Pay |
   | `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud console (Maps and Places) | Yes |

   Anything prefixed with `EXPO_PUBLIC_` is bundled into the app and can be extracted from it. Never put a secret there, such as a Stripe `sk_` key.

3. Start the app on a development build:

   ```bash
   yarn ios      # or: yarn android
   yarn start    # later runs, once the build is installed
   ```

## Scripts

| Command | What it does |
| --- | --- |
| `yarn start` | Starts Metro with a clean cache |
| `yarn ios`, `yarn android` | Builds and runs the app natively |
| `yarn lint` | Runs ESLint |
| `npx tsc --noEmit` | Type-checks the project |
