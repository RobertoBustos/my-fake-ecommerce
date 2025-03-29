import React, { useState } from "react";
import { Text } from "react-native";
import Layout from "../components/Layout";
import LoadingScreen from "../components/common/LoadingScreen";
import Product from "../components/product/Product";
import ProductFooter from "../components/product/ProductFooter";
import useAppNavigation from "../hooks/useAppNavigation";
import useCart from "../hooks/useCart";
import useProduct from "../hooks/useProduct";
import { addItemToCart } from "../redux/cart/reducer";
import { selectCartId } from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectSelectedOrderId } from "../redux/order/selectors";

const ProductScreen = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const cartId = useAppSelector(selectCartId);
  const [quantity, setQuantity] = useState<number>(1);
  const orderId = useAppSelector(selectSelectedOrderId);
  const { data, isLoading, refetch, error } = useProduct({
    filter: { field: "id", value: route.params.productId },
  });
  const { addProduct } = useCart();

  const handleAddToCart = (quantity: number) => {
    if (!data) return;
    addProduct({
      cartId: cartId,
      productId: data.id,
      quantity: quantity,
      orderId: orderId || null,
    }).then((data) => {
      dispatch(addItemToCart(data));
      navigation.goBack();
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
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
          disabled={data.stock === 0 || cartId === ""}
          onClick={() => handleAddToCart(quantity)}
        />
      }
    >
      <Product
        data={data}
        onQuantityChange={setQuantity}
        currentQuantity={quantity}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default ProductScreen;
