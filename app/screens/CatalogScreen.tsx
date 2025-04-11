import { StyleSheet, View } from "react-native";
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
