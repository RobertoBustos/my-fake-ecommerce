import { useMemo } from "react";
import { Text, View } from "react-native";
import { CartItemType } from "../constants/types";
import { useCartContext } from "../contexts/CartContext";
import styles from "../styles/components/CartItemCard";
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

  const getPriceText = useMemo(() => {
    return data.quantity + " X " + formatCurrency(data.unitPrice, data.currency);
  }, [data.quantity, data.unitPrice, data.currency]);

  return (
    <CustomCard
      orientation="horizontal"
      onPress={handlePress}
      disabled={disabled}
      testID={`CartItemCard.CardContainer-${data.productId}`}
    >
      <View
        style={styles.description}
        testID={`CartItemCard.CardDescription-${data.productId}`}
      >
        <Text
          style={styles.title}
          testID={`CartItemCard.Title-${data.productId}`}
        >
          {data.product.title}
        </Text>
        <Text
          style={styles.price}
          testID={`CartItemCard.Price-${data.productId}`}
        >
          {getPriceText}
        </Text>
        <Text
          style={styles.subtotal}
          testID={`CartItemCard.Subtotal-${data.productId}`}
        >
          {formatCurrency(data.subtotal, data.currency)}
        </Text>
      </View>
      <CustomImage
        imageUrl={data.product.image}
        width={120}
        height={120}
        testID={`CartItemCard.CardImage-${data.productId}`}
      />
      <CustomButton
        onPress={handleRemoveFromCart}
        buttonComponent={<DeleteButton size={30} />}
        testID={`CartItemCard.CardButton-${data.productId}`}
      />
    </CustomCard>
  );
};

export default CartItemCard;
