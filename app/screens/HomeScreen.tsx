import { useEffect } from "react";
import IncompleteOrdersList from "../components/IncompleteOrdersList";
import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";
import CatalogFooter from "../components/catalog/CatalogFooter";
import useCart from "../hooks/useCart";
import { setCartFromOrder, setCartId } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { fetchCart } = useCart();

  useEffect(() => {
    dispatch(setCartId())
      .unwrap()
      .then((cartId) => {
        fetchCart(cartId).then((data) => {
          if (data.data.carts.length === 0) return;
          dispatch(setCartFromOrder(data.data.carts));
        });
      });
    return () => {};
  }, [dispatch, fetchCart]);

  return (
    <Layout footerComponent={<CatalogFooter />}>
      <IncompleteOrdersList />
      <Catalog />
    </Layout>
  );
};

export default HomeScreen;
