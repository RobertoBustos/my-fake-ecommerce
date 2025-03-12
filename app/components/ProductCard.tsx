import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { ProductType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import { formatCurrency } from "../utils/formatCurrency";
import CustomCard from "./common/CustomCard";
import CustomImage from "./common/CustomImage";

export type ProductCardPropsType = {
  data: ProductType;
  disabled?: boolean;
};

const ProductCard = ({ data, disabled }: ProductCardPropsType) => {
  const navigation = useAppNavigation();

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
        <Text style={styles.price}>{formatCurrency(data.price)}</Text>
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
