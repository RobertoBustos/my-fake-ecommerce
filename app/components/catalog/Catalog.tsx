import { FlatList } from "react-native";
import useProduct from "../../hooks/useProduct";
import CatalogItemCard from "../CatalogItemCard";
import LoadingScreen from "../common/LoadingScreen";

const Catalog = () => {
  const { isLoading, data, refetch } = useProduct({ filter: null });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingScreen />;
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
