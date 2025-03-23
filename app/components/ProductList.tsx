import { useQuery } from "@apollo/client";
import { FlatList, StyleSheet, View } from "react-native";
import { GET_PRODUCTS } from "../graphql/queries";
import ProductCard from "./ProductCard";
import ProductListSkeleton from "./skeletons/ProductListSkeleton";

const ProductList = () => {
  const { loading, data, refetch } = useQuery(GET_PRODUCTS, {});

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return <ProductListSkeleton />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.getAllProducts}
        renderItem={({ item }) => <ProductCard data={item} />}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
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
