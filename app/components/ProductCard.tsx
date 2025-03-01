import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ProductType, RootStackParamList } from "../constants/types";
import { formatCurrency } from "../utils/formatCurrency";

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
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("Product", {
          productId: data.id,
        })
      }
      disabled={disabled}
    >
      <View style={styles.container}>
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
        <Image source={{ uri: data.image }} style={styles.image} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  description: {
    maxWidth: "70%",
    alignItems: "center",
    justifyContent: "center",
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
  image: {
    width: 100,
    height: 100,
  },
});
export default ProductCard;
