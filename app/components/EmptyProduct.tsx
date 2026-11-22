import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import styles from "../styles/components/EmptyProduct";

const EmptyProduct = () => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container} testID="EmptyProduct.Container">
      <FontAwesome6 name="sad-tear" size={200} color={theme.colors.disabled} />
      <Text style={styles.message} testID="EmptyProduct.Text">
        Item information not available
      </Text>
    </View>
  );
};

export default EmptyProduct;
