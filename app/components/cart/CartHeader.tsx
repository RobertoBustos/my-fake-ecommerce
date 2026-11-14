import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useCartContext } from "../../contexts/CartContext";
import styles from "../../styles/components/CartHeader";

const CartHeader = () => {
  const { theme } = useUnistyles();
  const { isCartEmpty } = useCartContext();

  if (isCartEmpty) {
    return null;
  }

  return (
    <View style={styles.container} testID="CartHeader.Container">
      <FontAwesome5
        name="file-invoice"
        size={theme.headerIconSize}
        color={theme.colors.primary}
      />
      <Text style={styles.text} testID="CartHeader.Text">
        These are the items in your shopping cart
      </Text>
    </View>
  );
};

export default CartHeader;
