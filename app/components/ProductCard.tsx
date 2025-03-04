import { useMemo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { useCartContext } from "../contexts/CartContext";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../utils/formatCurrency";
import CustomButton from "./common/CustomButton";
import CustomCard from "./common/CustomCard";
import CustomImage from "./common/CustomImage";
import { DeleteButton } from "./common/IconButtons";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";

export type ProductCardPropsType = {
  productId: number;
  disabled?: boolean;
  showCartUI?: boolean;
};

const ProductCard = ({
  productId,
  disabled,
  showCartUI = false,
}: ProductCardPropsType) => {
  const navigation = useAppNavigation();
  const { onRemove } = useCartContext();
  const { findProductById } = useProducts();
  const { findProductByIdInCart } = useCartContext();

  const productData = findProductById(productId);
  const productDataInCart = findProductByIdInCart(productId);

  const handleRemoveFromCart = () => {
    Alert.alert("Remove this item from cart?", "", [
      {
        text: "OK",
        onPress: () => onRemove(productId),
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
  if (productDataInCart) {
    priceStyles.color = colors.black;
  }

  const getPriceText = useMemo(() => {
    if (productDataInCart && productData) {
      return (
        productDataInCart.quantity +
        " X " +
        formatCurrency(productDataInCart.item.price)
      );
    }

    return productData ? formatCurrency(productData?.price) : "";
  }, [productData, productDataInCart]);

  return productData ? (
    <CustomCard
      orientation="horizontal"
      onPress={() =>
        navigation.navigate("Product", {
          productId,
        })
      }
      disabled={disabled}
    >
      <View style={styles.description}>
        <Text style={styles.title}>{productData.title}</Text>
        <Text style={priceStyles}>{getPriceText}</Text>
        {productDataInCart && showCartUI ? (
          <Text style={styles.subtotal}>
            {formatCurrency({
              amount:
                productDataInCart.item.price.amount *
                productDataInCart.quantity,
              currency: productDataInCart.item.price.currency,
            })}
          </Text>
        ) : null}
      </View>
      <CustomImage imageUrl={productData.image} width={120} height={120} />
      {productDataInCart && showCartUI ? (
        <CustomButton
          onPress={handleRemoveFromCart}
          buttonComponent={<DeleteButton color={colors.errorText} size={30} />}
        />
      ) : null}
    </CustomCard>
  ) : (
    <ProductCardSkeleton />
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

export default ProductCard;
