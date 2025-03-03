import { FlatList, StyleSheet, View } from "react-native";
import { ProductType } from "../constants/types";
import ProductCard from "./ProductCard";

export type ProductListPropsType = {
  products: ProductType[];
};

const ProductList = ({ products }: ProductListPropsType) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard productId={item.id} />}
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
