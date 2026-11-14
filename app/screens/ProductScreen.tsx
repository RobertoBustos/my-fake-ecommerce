import { StaticScreenProps } from "expo-router/react-navigation";
import React from "react";
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
        <Product />
      </Layout>
    </ProductStore>
  );
};

export default ProductScreen;
