import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useStyles } from "react-native-unistyles";
import { RootStackParamList } from "../constants/types";
import CartScreen from "../screens/CartScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import ProductScreen from "../screens/ProductScreen";
import NavigationHeader from "./NavigationHeader";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { theme } = useStyles();

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
