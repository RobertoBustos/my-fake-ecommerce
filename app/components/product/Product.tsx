import { RefreshControl, ScrollView, Text } from "react-native";
import { useProductContext } from "../../contexts/ProductContext";
import styles from "../../styles/components/Product";
import { formatCurrency } from "../../utils/formatCurrency";
import EmptyProduct from "../EmptyProduct";
import NoStockMessage from "../NoStockMessage";
import QuantityButtons from "../QuantityButtons";
import CustomImage from "../common/CustomImage";

const Product = () => {
  const {
    data,
    reloadProduct,
    isLoading,
    isAvailable,
    quantity,
    minQuantity,
    maxQuantity,
    setQuantity,
  } = useProductContext();

  const handleRefresh = () => {
    reloadProduct();
  };

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
      {isAvailable ? (
        <>
          <QuantityButtons
            min={minQuantity}
            max={maxQuantity}
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
