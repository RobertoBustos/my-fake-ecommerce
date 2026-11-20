# Test notifications for the iOS simulator

The same notifications the API sends through Expo Push Service, in the shape APNs
delivers them: Expo puts the push `data` under `body`, and expo-notifications reads
it from there.

Replace `ORDER_ID` with an order of the signed-in user, then send one to the app on a
booted simulator:

```sh
sed "s/ORDER_ID/<order id>/g" .maestro/push/order-completed.apns > /tmp/push.apns
xcrun simctl push booted <bundle id> /tmp/push.apns
```

The bundle id is `UNIQUE_IDENTIFIER` in `.env.local`. Tapping the notification opens
the order, with the app open, in the background or closed.
