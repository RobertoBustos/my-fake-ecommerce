import { StaticScreenProps } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Layout from "../components/Layout";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import { RootStackParamList } from "../constants/types";
import ProductStore from "../contexts/ProductContext";

export type ProductScreenPropsType = StaticScreenProps<
  RootStackParamList["Product"]
>;

const ProductScreen = ({ route }: ProductScreenPropsType) => {
  return (
    <ProductStore productId={route.params.productId}>
      <Layout footerComponent={<ProductFooter />} testID="ProductScreen.Layout">
        <View style={styles.container}>
          <Product />
        </View>
      </Layout>
    </ProductStore>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductScreen;
