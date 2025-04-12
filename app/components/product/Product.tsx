import { useProductContext } from "@/app/contexts/ProductContext";
import productStyleSheet from "@/app/styles/components/Product";
import { useMemo } from "react";
import { RefreshControl, ScrollView, Text } from "react-native";
import { useStyles } from "react-native-unistyles";
import { formatCurrency } from "../../utils/formatCurrency";
import EmptyProduct from "../EmptyProduct";
import NoStockMessage from "../NoStockMessage";
import QuantityButtons from "../QuantityButtons";
import CustomImage from "../common/CustomImage";

const Product = () => {
  const { data, reloadProduct, isLoading, quantity, setQuantity } =
    useProductContext();
  const { styles } = useStyles(productStyleSheet);

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
    return <EmptyProduct />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
      testID="Product.Container"
    >
      <Text style={styles.title} testID="Product.Title">
        {data.title}
      </Text>
      <CustomImage
        imageUrl={data.image}
        width={350}
        height={350}
        testID="Product.Image"
      />
      <Text style={styles.price} testID="Product.Price">
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
          <Text style={styles.stock} testID="Product.Stock">
            {data.stock} Available
          </Text>
        </>
      ) : (
        <NoStockMessage />
      )}
      <Text style={styles.descriptionTitle}>Description</Text>
      <Text style={styles.description} testID="Product.Description">
        {data.description}
      </Text>
    </ScrollView>
  );
};

export default Product;
