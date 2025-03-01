import { NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../constants/types";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductScreen from "../screens/ProductScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator>
        <Stack.Screen
          name="Products"
          component={HomeScreen}
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
      </Stack.Navigator>
    </NavigationIndependentTree>
  );
};

export default RootStack;
