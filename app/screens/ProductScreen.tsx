import { StaticScreenProps } from "@react-navigation/native";
import React from "react";
import Layout from "../components/Layout";
import LoadingScreen from "../components/common/LoadingScreen";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import { RootStackParamList } from "../constants/types";
import ProductStore, { useProductContext } from "../contexts/ProductContext";

export type ProductScreenPropsType = StaticScreenProps<
  RootStackParamList["Product"]
>;

const ProductScreen = ({ route }: ProductScreenPropsType) => {
  const { isLoading } = useProductContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ProductStore productId={route.params.productId}>
      <Layout footerComponent={<ProductFooter />}>
        <Product />
      </Layout>
    </ProductStore>
  );
};

export default ProductScreen;
