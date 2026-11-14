import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import styles from "../styles/components/NoStockMessages";

const NoStockMessage = () => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container} testID="NoStockMessage.Container">
      <FontAwesome6
        name="face-frown-open"
        size={48}
        color={theme.colors.error}
      />
      <Text style={styles.text} testID="NoStockMessage.Text">
        This Product is out of stock or not available for now. Please try again
        later
      </Text>
    </View>
  );
};

export default NoStockMessage;
