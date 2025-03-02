import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

const NoStockMessage = () => {
  return (
    <View style={styles.container}>
      <FontAwesome6 name="face-frown-open" size={48} color={colors.dark} />
      <Text style={styles.text}>
        This Product is out of stock or not available for now. Please try again
        later
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 30,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    paddingHorizontal: 24,
  },
});

export default NoStockMessage;
