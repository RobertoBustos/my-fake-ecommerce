import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import emptyCartStyleSheet from "../styles/components/EmptyCart";

const EmptyCart = () => {
  const { styles, theme } = useStyles(emptyCartStyleSheet);

  return (
    <View style={styles.container} testID="EmptyCart.Container">
      <FontAwesome
        name="shopping-cart"
        size={200}
        color={theme.colors.disabled}
      />
      <Text style={styles.message} testID="EmptyCart.Text">
        There are no items in your cart
      </Text>
    </View>
  );
};

export default EmptyCart;
