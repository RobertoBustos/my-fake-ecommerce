import { StyleSheet, Text, View } from "react-native";
import CustomButton from "./common/CustomButton";
import { AddButton, SubstractButton } from "./common/IconButtons";

export type AddToCartPropsType = {
  min: number;
  max: number;
  value: number;
  onChange: (quantity: number) => void;
};

const QuantityButtons = ({ min, max, value, onChange }: AddToCartPropsType) => {
  const incrementQuantity = () => {
    onChange(value + 1);
  };

  const decrementQuantity = () => {
    onChange(value - 1);
  };

  return (
    <View style={styles.container}>
      <CustomButton
        onPress={decrementQuantity}
        disabled={value <= min}
        buttonComponent={
          <SubstractButton
            color={value <= min ? "lightgray" : "teal"}
            size={55}
          />
        }
      />
      <Text style={styles.quantity}>{value.toString()}</Text>
      <CustomButton
        onPress={incrementQuantity}
        disabled={value >= max}
        buttonComponent={
          <AddButton color={value >= max ? "lightgray" : "teal"} size={55} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  quantity: {
    fontSize: 24,
    width: 80,
    textAlign: "center",
  },
});

export default QuantityButtons;
