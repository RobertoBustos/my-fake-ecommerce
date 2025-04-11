import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import CustomButton from "./common/CustomButton";
import { ReloadButton } from "./common/IconButtons";

export type EmptyOrderPropsType = {
  onRetry: () => void;
};

const EmptyOrder = ({ onRetry }: EmptyOrderPropsType) => {
  return (
    <View style={styles.container} testID="EmptyOrder.Container">
      <MaterialIcons name="error-outline" size={200} color={colors.dark} />
      <Text style={styles.message} testID="EmptyOrder.Text">
        There was a problem loading the order information
      </Text>
      <CustomButton
        buttonComponent={<ReloadButton />}
        onPress={onRetry}
        testID="EmptyOrder.RetryButton"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 32,
    textAlign: "center",
    marginTop: 24,
    color: colors.dark,
    marginBottom: 16,
  },
});

export default EmptyOrder;
