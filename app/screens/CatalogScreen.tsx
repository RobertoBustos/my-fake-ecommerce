import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import IncompleteOrdersList from "../components/IncompleteOrdersList";
import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";
import CatalogFooter from "../components/catalog/CatalogFooter";
import useCart from "../hooks/useCart";
import { setCartFromOrder, setCartId } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";

const CatalogScreen = () => {
  const dispatch = useAppDispatch();
  const { fetchCart } = useCart();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch(setCartId())
        .unwrap()
        .then((cartId) => {
          fetchCart(cartId).then((data) => {
            if (data.data.carts.length === 0) return;
            dispatch(setCartFromOrder(data.data.carts));
          });
        });
    }
    return () => {};
  }, [dispatch, fetchCart, isFocused]);

  return (
    <Layout
      headerComponent={<IncompleteOrdersList />}
      footerComponent={<CatalogFooter />}
      testID="CatalogScreen.Layout"
    >
      <View style={styles.container}>
        <Catalog />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
});

export default CatalogScreen;
