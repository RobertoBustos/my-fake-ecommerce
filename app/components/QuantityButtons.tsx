import { Text, View } from "react-native";
import styles from "../styles/components/QuantityButtons";
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
        buttonComponent={<MinusButton size={30} disabled={value <= min} />}
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
        buttonComponent={<PlusButton size={30} disabled={value >= max} />}
        testID="QuantityButtons.Increment"
      />
    </View>
  );
};

export default QuantityButtons;
