import IncompleteOrdersList from "../components/IncompleteOrdersList";
import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";

const CatalogScreen = () => {
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
