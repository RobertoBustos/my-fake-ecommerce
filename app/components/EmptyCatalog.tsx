import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import emptyCatalogStyleSheet from "../styles/components/EmptyCatalog";
import CustomButton from "./common/CustomButton";
import { ReloadButton } from "./common/IconButtons";

export type EmptyCatalogPropsType = {
  onRetry: () => void;
};

const EmptyCatalog = ({ onRetry }: EmptyCatalogPropsType) => {
  const { styles, theme } = useStyles(emptyCatalogStyleSheet);

  return (
    <View style={styles.container} testID="EmptyCatalog.Container">
      <MaterialIcons
        name="error-outline"
        size={200}
        color={theme.colors.disabled}
      />
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

export default EmptyCatalog;
