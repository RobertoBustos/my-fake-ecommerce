import { FlatList } from "react-native";
import useProduct from "../../hooks/useProduct";
import CatalogItemCard from "../CatalogItemCard";
import EmptyCatalog from "../EmptyCatalog";
import LoadingScreen from "../common/LoadingScreen";

const Catalog = () => {
  const { isLoading, data, refetch, isCatalogEmpty } = useProduct({
    filter: null,
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isCatalogEmpty) {
    return <EmptyCatalog onRetry={handleRefresh} />;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <CatalogItemCard data={item} />}
      showsVerticalScrollIndicator={false}
      refreshing={isLoading}
      onRefresh={handleRefresh}
      testID="Catalog.Container"
    />
  );
};

export default Catalog;
