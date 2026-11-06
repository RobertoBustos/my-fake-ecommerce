import { ActivityIndicator, FlatList } from "react-native";
import useProduct from "../../hooks/useProduct";
import CatalogItemCard from "../CatalogItemCard";
import EmptyCatalog from "../EmptyCatalog";
import LoadingScreen from "../common/LoadingScreen";

const Catalog = () => {
  const { isLoading, isRefreshing, isLoadingMore, data, refetch, isCatalogEmpty, loadMore } =
    useProduct({});

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading && isCatalogEmpty) {
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
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isLoadingMore ? <ActivityIndicator /> : null}
      testID="Catalog.Container"
    />
  );
};

export default Catalog;
