import Layout from "../components/Layout";
import Catalog from "../components/catalog/Catalog";
import CatalogFooter from "../components/catalog/CatalogFooter";

const HomeScreen = () => {
  return (
    <Layout footerComponent={<CatalogFooter />}>
      <Catalog />
    </Layout>
  );
};

export default HomeScreen;
