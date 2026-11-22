import FontAwesome from "@expo/vector-icons/FontAwesome";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Alert, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";
import ShoppingCartHeaderIcon from "../components/ShoppingCartHeaderIcon";
import { useAuthContext } from "../contexts/AuthContext";
import styles from "../styles/components/NavigationHeader";

const NavigationHeader = (props: NativeStackHeaderProps) => {
  const { theme } = useUnistyles();
  const { isAnonymous, signOut } = useAuthContext();
  // The screens draw edge-to-edge, so the header extends under the status bar
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    props.navigation.goBack();
  };

  const handleRedirectToCart = () => {
    props.navigation.navigate("Cart");
  };

  const handleRedirectToLogin = () => {
    props.navigation.navigate("Login");
  };

  const handleSignOut = () => {
    Alert.alert("Sign out?", "", [
      {
        text: "OK",
        onPress: () => signOut(),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={[styles.statusBarArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.backContainer}>
          {props.navigation.canGoBack() ? (
            <FontAwesome
              name="chevron-left"
              size={30}
              color={theme.colors.onPrimary}
              onPress={handleGoBack}
              testID="NavigationHeader.Back"
            />
          ) : isAnonymous ? (
            <FontAwesome
              name="user-circle-o"
              size={30}
              color={theme.colors.onPrimary}
              onPress={handleRedirectToLogin}
              testID="NavigationHeader.Login"
            />
          ) : (
            <FontAwesome
              name="sign-out"
              size={30}
              color={theme.colors.onPrimary}
              onPress={handleSignOut}
              testID="NavigationHeader.SignOut"
            />
          )}
        </View>
        <Text style={styles.title}>{props.options.title}</Text>
        {props.route.name === "Login" ? (
          <View style={styles.backContainer} />
        ) : (
          <ShoppingCartHeaderIcon onPress={handleRedirectToCart} />
        )}
      </View>
    </View>
  );
};

export default NavigationHeader;
