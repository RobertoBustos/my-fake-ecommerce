import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Text } from "react-native";
import Layout from "../components/Layout";
import LoadingScreen from "../components/common/LoadingScreen";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import useAppNavigation from "../hooks/useAppNavigation";
import { addItemToCart } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";

const ProductScreen = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [quantity, setQuantity] = useState<number>(1);
  const { loading, error, data, refetch } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId: route.params.productId },
  });

  const handleAddToCart = (quantity: number) => {
    if (!data) return;
    dispatch(
      addItemToCart({
        ...data,
        cartItemId: data.id,
        quantity: quantity,
        subtotal: data.unitPrice * quantity,
      })
    );
    navigation.goBack();
  };

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
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
          disabled={data.stock === 0}
          onClick={() => handleAddToCart(quantity)}
        />
      }
    >
      <Product
        data={data}
        onQuantityChange={setQuantity}
        currentQuantity={quantity}
        onRefresh={handleRefresh}
        isLoading={loading}
      />
    </Layout>
  );
};

export default ProductScreen;
