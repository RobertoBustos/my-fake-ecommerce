import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import emptyProductStyleSheet from "../styles/components/EmptyProduct";

const EmptyProduct = () => {
  const { styles, theme } = useStyles(emptyProductStyleSheet);

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
