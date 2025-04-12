import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useStyles } from "react-native-unistyles";
import { RootStackParamList } from "../constants/types";
import useCart from "../hooks/useCart";
import { setCartFromOrder, setCartId } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";
import CartScreen from "../screens/CartScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import ProductScreen from "../screens/ProductScreen";
import NavigationHeader from "./NavigationHeader";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const { fetchCart } = useCart();

  useEffect(() => {
    dispatch(setCartId())
      .unwrap()
      .then((cartId) => {
        fetchCart(cartId).then((data) => {
          SplashScreen.hide();
          if (data.data.carts.length === 0) return;
          dispatch(setCartFromOrder(data.data.carts));
        });
      });

    return () => {};
  }, [dispatch, fetchCart]);

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
