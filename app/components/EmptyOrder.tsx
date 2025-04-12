import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { useStyles } from "react-native-unistyles";
import emptyOrderStyleSheet from "../styles/components/EmptyOrder";
import CustomButton from "./common/CustomButton";
import { ReloadButton } from "./common/IconButtons";

export type EmptyOrderPropsType = {
  onRetry: () => void;
};

const EmptyOrder = ({ onRetry }: EmptyOrderPropsType) => {
  const { styles, theme } = useStyles(emptyOrderStyleSheet);

  return (
    <View style={styles.container} testID="EmptyOrder.Container">
      <MaterialIcons
        name="error-outline"
        size={200}
        color={theme.colors.disabled}
      />
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

export default EmptyOrder;
