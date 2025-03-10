import { useMemo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { CartItemType } from "../constants/types";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { removeItemFromCart } from "../redux/cart/reducer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsOrderComplete } from "../redux/order/selectors";
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
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const isProductInCart = data.cartItemId !== undefined;
  const isOrderComplete = useAppSelector(selectIsOrderComplete);

  const handleRemoveFromCart = () => {
    Alert.alert("Remove this item from cart?", "", [
      {
        text: "OK",
        onPress: () => dispatch(removeItemFromCart(data.cartItemId)),
        style: "default",
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  const priceStyles = { ...styles.price };
  if (isProductInCart) {
    priceStyles.color = colors.black;
  }

  const getPriceText = useMemo(() => {
    return data.quantity + " X " + formatCurrency(data.price);
  }, [data.price, data.quantity]);

  return (
    <CustomCard
      orientation="horizontal"
      onPress={() =>
        navigation.navigate("Product", {
          productId: data.id,
        })
      }
      disabled={true}
    >
      <View style={styles.description}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={priceStyles}>{getPriceText}</Text>
        <Text style={styles.subtotal}>
          {formatCurrency({
            amount: data.subtotal || 0,
            currency: data.price.currency,
          })}
        </Text>
      </View>
      <CustomImage imageUrl={data.image} width={120} height={120} />
      {!isOrderComplete ? (
        <CustomButton
          onPress={handleRemoveFromCart}
          buttonComponent={<DeleteButton color={colors.errorText} size={30} />}
        />
      ) : null}
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
