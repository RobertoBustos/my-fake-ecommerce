import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
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
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: "100%" }}>
        <CustomButton
          onPress={onEditOrder}
          buttonComponent={
            <DefaultButton
              text={editOrderLabel}
              backgroundColor={colors.warning}
            />
          }
        />
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <CustomButton
          onPress={onCancelOrder}
          buttonComponent={
            <DefaultButton
              text={cancelOrderLabel}
              backgroundColor={colors.error}
            />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,
    paddingVertical: 8,
    flexDirection: "row",
    gap: 32,
  },
});

export default CheckoutButtons;
