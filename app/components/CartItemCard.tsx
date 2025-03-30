import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { CartItemType } from "../constants/types";
import { useCartContext } from "../contexts/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import CustomButton from "./common/CustomButton";
import CustomCard from "./common/CustomCard";
import CustomImage from "./common/CustomImage";
import { DeleteButton } from "./common/IconButtons";

export type CartItemCardPropsType = {
  data: CartItemType;
  disabled?: boolean;
};

const CartItemCard = ({ data, disabled }: CartItemCardPropsType) => {
  const { removeFromCart, redirectToProduct } = useCartContext();

  const handleRemoveFromCart = () => {
    removeFromCart(data.id);
  };

  const handlePress = () => {
    redirectToProduct(data.product.id);
  };

  const priceStyles = { ...styles.price, color: colors.black };

  const getPriceText = useMemo(() => {
    return data.quantity + " X " + formatCurrency(data.unitPrice);
  }, [data.quantity, data.unitPrice]);

  return (
    <CustomCard
      orientation="horizontal"
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={styles.description}>
        <Text style={styles.title}>{data.product.title}</Text>
        <Text style={priceStyles}>{getPriceText}</Text>
        <Text style={styles.subtotal}>{formatCurrency(data.subtotal)}</Text>
      </View>
      <CustomImage imageUrl={data.product.image} width={120} height={120} />
      <CustomButton
        onPress={handleRemoveFromCart}
        buttonComponent={<DeleteButton color={colors.error} size={30} />}
      />
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  description: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtotal: {
    color: colors.primary,
    fontSize: 24,
  },
});

export default CartItemCard;
