import { useNavigation } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import NoStockMessage from "../components/NoStockMessage";
import QuantityButtons from "../components/QuantityButtons";
import { useCartContext } from "../contexts/cartContext";
import { useProductDetails } from "../hooks/useProductDetails";
import { formatCurrency } from "../utils/formatCurrency";

const ProductScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { isLoading, response } = useProductDetails(route.params.productId);
  const { onAdd } = useCartContext();
  const [quantity, setQuantity] = useState<number>(1);

  const maxPurchaseLimit = useMemo(() => {
    if (!response) return 0;
    return response.purchaseLimit?.max
      ? response.purchaseLimit?.max > response.stock
        ? response.stock
        : response.purchaseLimit?.max
      : response.stock;
  }, [response]);

  const handleAddToCart = (quantity: number) => {
    if (!response) return;
    onAdd({
      item: response,
      quantity: quantity,
      subtotal: response.price.amount * quantity,
    });
    navigation.goBack();
  };

  const renderFooter = () => {
    return (
      <FooterButton
        text={"Add to Cart"}
        onPress={() => handleAddToCart(quantity)}
        disabled={response?.stock === 0}
      />
    );
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
    <Layout footerComponent={renderFooter()}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{response.title}</Text>
        <Image source={{ uri: response.image }} style={styles.image} />
        <Text style={styles.price}>{formatCurrency(response.price)}</Text>
        {response.stock >= 1 ? (
          <>
            <QuantityButtons
              min={response.purchaseLimit?.min || 1}
              max={maxPurchaseLimit}
              value={quantity}
              onChange={setQuantity}
            />
            <Text style={styles.stock}>{response.stock} Available</Text>
          </>
        ) : (
          <NoStockMessage />
        )}
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{response.description}</Text>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "teal",
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "left",
  },
  description: {
    textAlign: "justify",
    marginTop: 8,
  },
  stock: {
    fontSize: 16,
    marginTop: 20,
    color: "black",
  },
});

export default ProductScreen;
