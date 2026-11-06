import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useStyles } from "react-native-unistyles";
import { RootStackParamList } from "../constants/types";
import { useAuthContext } from "../contexts/AuthContext";
import useAppState from "../hooks/useAppState";
import useInitialFetch from "../hooks/useInitialFetch";
import AddressScreen from "../screens/AddressScreen";
import CartScreen from "../screens/CartScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import CustomerScreen from "../screens/CustomerScreen";
import LoginScreen from "../screens/LoginScreen";
import ProductScreen from "../screens/ProductScreen";
import NavigationHeader from "./NavigationHeader";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { theme } = useStyles();
  const { user, isInitializing } = useAuthContext();
  useInitialFetch(user?.uid);
  useAppState();

  // With a user, the splash screen is hidden once the cart is loaded.
  // Without one the anonymous sign in failed, and it asks to try again
  useEffect(() => {
    if (!isInitializing && !user) SplashScreen.hide();
    return () => {};
  }, [isInitializing, user]);

  if (!user) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        statusBarBackgroundColor: theme.colors.primary,
        header: (props) => {
          return <NavigationHeader {...props} />;
        },
      }}
    >
      <Stack.Screen
        name="Products"
        component={CatalogScreen}
        options={{ title: "Products" }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={({ route }) => ({
          title: `Product Details`,
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={({ route }) => ({
          title: `My Cart`,
        })}
      />
      <Stack.Screen
        name="Customer"
        component={CustomerScreen}
        options={({ route }) => ({
          title: `Customer Information`,
        })}
      />
      <Stack.Screen
        name="Address"
        component={AddressScreen}
        options={({ route }) => ({
          title: `Address Information`,
        })}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={({ route }) => ({
          title: `Checkout`,
        })}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={({ route }) => ({
          title: `Order Complete`,
        })}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "My Account" }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
