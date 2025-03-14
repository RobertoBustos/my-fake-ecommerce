import { FlatList, StyleSheet, View } from "react-native";
import { fetchProducts, setRefresingState } from "../redux/cart/reducer";
import {
  selectIsDataRefreshing,
  selectProducts,
} from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const isRefresing = useAppSelector(selectIsDataRefreshing);

  const handleRefresh = () => {
    dispatch(setRefresingState(true));
    setTimeout(() => {
      dispatch(fetchProducts());
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard data={item} />}
        showsVerticalScrollIndicator={false}
        refreshing={isRefresing}
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
