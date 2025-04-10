import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

const EmptyProduct = () => {
  return (
    <View style={styles.container} testID="EmptyProduct.Container">
      <FontAwesome6 name="sad-tear" size={200} color={colors.dark} />
      <Text style={styles.message} testID="EmptyProduct.Text">
        Item information not available
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 24,
    color: colors.dark,
  },
});

export default EmptyProduct;
