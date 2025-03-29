import { FlatList, StyleSheet, View } from "react-native";
import useProduct from "../hooks/useProduct";
import ProductCard from "./ProductCard";
import ProductListSkeleton from "./skeletons/ProductListSkeleton";

const ProductList = () => {
  const { isLoading, data, refetch } = useProduct({ filter: null });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <ProductCard data={item} />}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export default ProductList;
