import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import Layout from "../components/Layout";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useProductDetails } from "../hooks/useProductDetails";
import { addItemToCart } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";

const ProductScreen = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { isLoading, response } = useProductDetails(route.params.productId);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = (quantity: number) => {
    if (!response) return;
    dispatch(
      addItemToCart({
        ...response,
        cartItemId: response.id,
        quantity: quantity,
        subtotal: response.price.amount * quantity,
      })
    );
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <Layout>
        <ActivityIndicator size="large" color={"black"} style={styles.loader} />
      </Layout>
    );
  }

  if (!response) {
    return (
      <Layout>
        <Text>Item Not Found</Text>
      </Layout>
    );
  }

  return (
    <Layout
      footerComponent={
        <ProductFooter
          disabled={response.stock === 0}
          onClick={() => handleAddToCart(quantity)}
        />
      }
    >
      <Product
        data={response}
        onQuantityChange={setQuantity}
        currentQuantity={quantity}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
  },
});

export default ProductScreen;
