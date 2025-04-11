import IncompleteOrdersList from "../components/IncompleteOrdersList";
import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";
import CatalogFooter from "../components/catalog/CatalogFooter";
import useInitialFetch from "../hooks/useInitialFetch";

const CatalogScreen = () => {
  useInitialFetch();

  return (
    <Layout
      headerComponent={<IncompleteOrdersList />}
      footerComponent={<CatalogFooter />}
      testID="CatalogScreen.Layout"
    >
      <Catalog />
    </Layout>
  );
};

export default CatalogScreen;
