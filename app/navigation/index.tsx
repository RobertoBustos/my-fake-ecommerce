import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useStyles } from "react-native-unistyles";
import { RootStackParamList } from "../constants/types";
import useAppState from "../hooks/useAppState";
import useInitialFetch from "../hooks/useInitialFetch";
import AddressScreen from "../screens/AddressScreen";
import CartScreen from "../screens/CartScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import CustomerScreen from "../screens/CustomerScreen";
import ProductScreen from "../screens/ProductScreen";
import NavigationHeader from "./NavigationHeader";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { theme } = useStyles();
  useInitialFetch();
  useAppState();

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
    </Stack.Navigator>
  );
};

export default RootStack;
