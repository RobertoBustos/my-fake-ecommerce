import { useMemo } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { ProductType } from "../../constants/types";
import { formatCurrency } from "../../utils/formatCurrency";
import NoStockMessage from "../NoStockMessage";
import QuantityButtons from "../QuantityButtons";
import CustomImage from "../common/CustomImage";

export type ProdctPropsType = {
  data: ProductType;
  currentQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
};

const Product = ({
  data,
  currentQuantity,
  onQuantityChange,
  onRefresh,
  isLoading = false,
}: ProdctPropsType) => {
  const handleRefresh = () => {
    setTimeout(() => {
      if (onRefresh) onRefresh();
    }, 1000);
  };

  const maxPurchaseLimit = useMemo(() => {
    if (!data) return 0;
    return data.purchaseLimit?.max
      ? data.purchaseLimit?.max > data.stock
        ? data.stock
        : data.purchaseLimit?.max
      : data.stock;
  }, [data]);

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
          {formatCurrency({ amount: data.unitPrice, currency: data.currency })}
        </Text>
        {data.stock >= 1 ? (
          <>
            <QuantityButtons
              min={data.purchaseLimit?.min || 1}
              max={maxPurchaseLimit}
              value={currentQuantity}
              onChange={onQuantityChange}
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
