import { useEffect } from "react";
import IncompleteOrdersList from "../components/IncompleteOrdersList";
import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";
import CatalogFooter from "../components/catalog/CatalogFooter";
import { setCartId } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";

const HomeScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCartId());
    return () => {};
  }, [dispatch]);

  return (
    <Layout footerComponent={<CatalogFooter />}>
      <IncompleteOrdersList />
      <Catalog />
    </Layout>
  );
};

export default HomeScreen;
