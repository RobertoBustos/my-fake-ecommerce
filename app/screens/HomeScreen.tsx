import { useEffect } from "react";
import IncompleteOrdersList from "../components/IncompleteOrdersList";
import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";
import CatalogFooter from "../components/catalog/CatalogFooter";
import { useAppDispatch } from "../redux/hooks";
import { fetchIncompleteOrders } from "../redux/order/reducer";

const HomeScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIncompleteOrders(""));
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
