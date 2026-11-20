import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import styles from "../styles/components/EmptyOrder";
import CustomButton from "./common/CustomButton";
import { ReloadButton } from "./common/IconButtons";

export type EmptyOrderPropsType = {
  onRetry: () => void;
  message?: string;
};

const EmptyOrder = ({
  onRetry,
  message = "There was a problem loading the order information",
}: EmptyOrderPropsType) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container} testID="EmptyOrder.Container">
      <MaterialIcons
        name="error-outline"
        size={200}
        color={theme.colors.disabled}
      />
      <Text style={styles.message} testID="EmptyOrder.Text">
        {message}
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
