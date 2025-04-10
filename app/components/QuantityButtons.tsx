import { Platform, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import CustomButton from "./common/CustomButton";
import { MinusButton, PlusButton } from "./common/IconButtons";

export type AddToCartPropsType = {
  min: number;
  max: number;
  value: number;
  onChange: (quantity: number) => void;
  showValue?: boolean;
};

const QuantityButtons = ({
  min,
  max,
  value,
  onChange,
  showValue = true,
}: AddToCartPropsType) => {
  const incrementQuantity = () => {
    onChange(value + 1);
  };

  const decrementQuantity = () => {
    onChange(value - 1);
  };

  return (
    <View style={styles.container} testID="QuantityButtons.Container">
      <CustomButton
        onPress={decrementQuantity}
        disabled={value <= min}
        buttonComponent={
          <MinusButton
            color={colors.light}
            size={30}
            backgroundColor={value <= min ? colors.dark : colors.primary}
          />
        }
        testID="QuantityButtons.Decrement"
      />
      {showValue ? (
        <Text style={styles.quantity} testID="QuantityButtons.Quantity">
          {value.toString()}
        </Text>
      ) : null}
      <CustomButton
        onPress={incrementQuantity}
        disabled={value >= max}
        buttonComponent={
          <PlusButton
            color={colors.light}
            size={30}
            backgroundColor={value >= max ? colors.dark : colors.primary}
          />
        }
        testID="QuantityButtons.Increment"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  quantity: {
    flex: 1,
    fontSize: 24,
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: Platform.OS === "ios" ? 7 : 0,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: colors.dark,
    borderBottomColor: colors.dark,
  },
});

export default QuantityButtons;
