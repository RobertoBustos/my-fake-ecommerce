import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../constants/types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// The order on screen, if the visible screen is an order's confirmation
export const getVisibleOrderId = (): string | undefined => {
  if (!navigationRef.isReady()) return undefined;
  const route = navigationRef.getCurrentRoute();
  if (route?.name !== "Confirmation") return undefined;
  return (route.params as RootStackParamList["Confirmation"]).orderId;
};
