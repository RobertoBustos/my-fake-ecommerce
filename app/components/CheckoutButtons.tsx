import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import styles from "../styles/components/CheckoutButtons";
import CustomButton from "./common/CustomButton";
import DefaultButton from "./common/IconButtons";

export type CheckoutButtonsPropsType = {
  editOrderLabel: string;
  cancelOrderLabel: string;
  onEditOrder: () => void;
  onCancelOrder: () => void;
};

const CheckoutButtons = ({
  editOrderLabel,
  cancelOrderLabel,
  onEditOrder,
  onCancelOrder,
}: CheckoutButtonsPropsType) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container} testID="CheckoutButtons.Container">
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onEditOrder}
          buttonComponent={
            <DefaultButton
              text={editOrderLabel}
              backgroundColor={theme.colors.warning}
            />
          }
          testID="CheckoutButtons.EditOrderButton"
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onCancelOrder}
          buttonComponent={
            <DefaultButton
              text={cancelOrderLabel}
              backgroundColor={theme.colors.error}
            />
          }
          testID="CheckoutButtons.CancelOrderButton"
        />
      </View>
    </View>
  );
};

export default CheckoutButtons;
