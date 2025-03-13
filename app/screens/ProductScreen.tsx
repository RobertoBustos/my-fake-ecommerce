import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import Layout from "../components/Layout";
import LoadingScreen from "../components/common/LoadingScreen";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import useAppNavigation from "../hooks/useAppNavigation";
import { addItemToCart, fetchProductById } from "../redux/cart/reducer";
import {
  selectIsProductsLoading,
  selectProductData,
} from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const ProductScreen = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const productData = useAppSelector(selectProductData);
  const isLoading = useAppSelector(selectIsProductsLoading);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    dispatch(fetchProductById(route.params.productId));
    return () => {};
  }, [dispatch, route.params.productId]);

  const handleAddToCart = (quantity: number) => {
    if (!productData) return;
    dispatch(
      addItemToCart({
        ...productData,
        cartItemId: productData.id,
        quantity: quantity,
        subtotal: productData.price.amount * quantity,
      })
    );
    navigation.goBack();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!productData) {
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
          disabled={productData.stock === 0}
          onClick={() => handleAddToCart(quantity)}
        />
      }
    >
      <Product
        data={productData}
        onQuantityChange={setQuantity}
        currentQuantity={quantity}
      />
    </Layout>
  );
};

export default ProductScreen;
