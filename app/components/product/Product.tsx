import { useProductContext } from "@/app/contexts/ProductContext";
import { useMemo } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { formatCurrency } from "../../utils/formatCurrency";
import NoStockMessage from "../NoStockMessage";
import QuantityButtons from "../QuantityButtons";
import CustomImage from "../common/CustomImage";

const Product = () => {
  const { data, reloadProduct, isLoading, quantity, setQuantity } =
    useProductContext();

  const handleRefresh = () => {
    reloadProduct();
  };

  const maxPurchaseLimit = useMemo(() => {
    if (!data) return 0;
    return data.purchaseLimits.max > data.stock
      ? data.stock
      : data.purchaseLimits.max;
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.title}>{data.title}</Text>
        <CustomImage imageUrl={data.image} width={350} height={350} />
        <Text style={styles.price}>
          {formatCurrency(data.unitPrice, data.currency)}
        </Text>
        {data.stock >= 1 ? (
          <>
            <QuantityButtons
              min={data.purchaseLimits.min || 1}
              max={maxPurchaseLimit}
              value={quantity}
              onChange={setQuantity}
            />
            <Text style={styles.stock}>{data.stock} Available</Text>
          </>
        ) : (
          <NoStockMessage />
        )}
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{data.description}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: colors.primary,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "left",
  },
  description: {
    textAlign: "justify",
    marginTop: 8,
  },
  stock: {
    fontSize: 16,
    marginTop: 20,
    color: colors.black,
  },
});

export default Product;
