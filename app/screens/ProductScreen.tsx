import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Text } from "react-native";
import Layout from "../components/Layout";
import LoadingScreen from "../components/common/LoadingScreen";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import { ADD_PRODUCT } from "../graphql/mutations";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import useAppNavigation from "../hooks/useAppNavigation";
import { addItemToCart } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";

const ProductScreen = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const [quantity, setQuantity] = useState<number>(1);
  const { loading, error, data, refetch } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: route.params.productId.toString() },
  });
  const [addToCart] = useMutation(ADD_PRODUCT);

  const handleAddToCart = (quantity: number) => {
    if (!data.product) return;
    addToCart({
      variables: {
        productId: data.product.id,
        quantity: quantity,
      },
    }).then(({ data }) => {
      dispatch(addItemToCart(data.addToCart));
      navigation.goBack();
    });
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
          disabled={data.product.stock === 0}
          onClick={() => handleAddToCart(quantity)}
        />
      }
    >
      <Product
        data={data.product}
        onQuantityChange={setQuantity}
        currentQuantity={quantity}
        onRefresh={handleRefresh}
        isLoading={loading}
      />
    </Layout>
  );
};

export default ProductScreen;
