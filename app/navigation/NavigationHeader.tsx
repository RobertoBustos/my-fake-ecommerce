import FontAwesome from "@expo/vector-icons/FontAwesome";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import ShoppingCartHeaderIcon from "../components/ShoppingCartHeaderIcon";
import navigationHeaderStyleSheet from "../styles/components/NavigationHeader";

const NavigationHeader = (props: NativeStackHeaderProps) => {
  const { styles, theme } = useStyles(navigationHeaderStyleSheet);

  const handleGoBack = () => {
    props.navigation.goBack();
  };

  const handleRedirectToCart = () => {
    props.navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        {props.navigation.canGoBack() ? (
          <FontAwesome
            name="chevron-left"
            size={30}
            color={theme.colors.onPrimary}
            onPress={handleGoBack}
          />
        ) : null}
      </View>
      <Text style={styles.title}>{props.options.title}</Text>
      <ShoppingCartHeaderIcon onPress={handleRedirectToCart} />
    </View>
  );
};

export default NavigationHeader;
