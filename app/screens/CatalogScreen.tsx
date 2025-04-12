import IncompleteOrdersList from "../components/IncompleteOrdersList";
import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";
import useInitialFetch from "../hooks/useInitialFetch";

const CatalogScreen = () => {
  useInitialFetch();

  return (
    <Layout
      headerComponent={<IncompleteOrdersList />}
      testID="CatalogScreen.Layout"
    >
      <Catalog />
    </Layout>
  );
};

export default CatalogScreen;
