import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ProductType, RootStackParamList } from "../constants/types";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";
import CustomImage from "./common/CustomImage";

export type ProductCardPropsType = {
  data: ProductType;
  disabled?: boolean;
  quantity?: number;
};

const ProductCard = ({ data, disabled, quantity }: ProductCardPropsType) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const getPriceText = useMemo(() => {
    const quantityText = quantity ? `${quantity} X ` : "";
    return quantityText + formatCurrency(data.price);
  }, []);

  const priceStyles = { ...styles.price };
  if (quantity) {
    priceStyles.color = "black";
  }

  return (
    <CustomCard
      orientation="horizontal"
      onPress={() =>
        navigation.navigate("Product", {
          productId: data.id,
        })
      }
      disabled={disabled}
    >
      <View style={styles.description}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={priceStyles}>{getPriceText}</Text>
        {quantity ? (
          <Text style={styles.subtotal}>
            {formatCurrency({
              amount: data.price.amount * quantity,
              currency: data.price.currency,
            })}
          </Text>
        ) : null}
      </View>
      <CustomImage imageUrl={data.image} width={120} height={120} />
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
    color: "teal",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtotal: {
    color: "teal",
    fontSize: 24,
  },
});
export default ProductCard;
