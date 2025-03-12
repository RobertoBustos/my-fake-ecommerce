import { useEffect } from "react";
import Layout from "../components/Layout";
import PendingOrderMessage from "../components/PendingOrderMessage";
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
      <PendingOrderMessage />
      <Catalog />
    </Layout>
  );
};

export default HomeScreen;
