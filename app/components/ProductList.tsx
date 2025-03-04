import { FlatList, StyleSheet, View } from "react-native";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const { products } = useProducts();

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard data={item} />}
        showsVerticalScrollIndicator={false}
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
