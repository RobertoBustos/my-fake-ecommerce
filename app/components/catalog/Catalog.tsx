import { useProducts } from "@/app/hooks/useProducts";
import ProductList from "../ProductList";
import ProductListSkeleton from "../skeletons/ProductListSkeleton";
import CatalogHeader from "./CatalogHeader";

const Catalog = () => {
  const { isLoading } = useProducts();

  return isLoading ? (
    <ProductListSkeleton />
  ) : (
    <>
      <CatalogHeader />
      <ProductList />
    </>
  );
};

export default Catalog;
