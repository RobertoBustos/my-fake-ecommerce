import React from "react";
import Layout from "../components/Layout";
import LoadingScreen from "../components/common/LoadingScreen";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import ProductStore, { useProductContext } from "../contexts/ProductContext";

const ProductScreen = () => {
  const { isLoading } = useProductContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ProductStore>
      <Layout footerComponent={<ProductFooter />}>
        <Product />
      </Layout>
    </ProductStore>
  );
};

export default ProductScreen;
