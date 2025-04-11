import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import CustomButton from "./common/CustomButton";
import { ReloadButton } from "./common/IconButtons";

export type EmptyCatalogPropsType = {
  onRetry: () => void;
};

const EmptyCatalog = ({ onRetry }: EmptyCatalogPropsType) => {
  return (
    <View style={styles.container} testID="EmptyCatalog.Container">
      <MaterialIcons name="error-outline" size={200} color={colors.dark} />
      <Text style={styles.message} testID="EmptyCatalog.Text">
        There was a problem loading the catalog
      </Text>
      <CustomButton
        buttonComponent={<ReloadButton />}
        onPress={onRetry}
        testID="EmptyCatalog.RetryButton"
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

export default EmptyCatalog;
