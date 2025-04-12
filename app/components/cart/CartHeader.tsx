import { useCartContext } from "@/app/contexts/CartContext";
import cartHeaderStyleSheet from "@/app/styles/components/CartHeader";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";

const CartHeader = () => {
  const { styles, theme } = useStyles(cartHeaderStyleSheet);
  const { isCartEmpty } = useCartContext();

  if (isCartEmpty) {
    return null;
  }

  return (
    <View style={styles.container} testID="CartHeader.Container">
      <FontAwesome5
        name="file-invoice"
        size={150}
        color={theme.colors.primary}
      />
      <Text style={styles.text} testID="CartHeader.Text">
        These are the items in your shopping cart
      </Text>
    </View>
  );
};

export default CartHeader;
