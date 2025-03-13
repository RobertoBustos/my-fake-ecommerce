import { selectIsProductsLoading } from "../../redux/cart/selectors";
import { useAppSelector } from "../../redux/hooks";
import ProductList from "../ProductList";
import ProductListSkeleton from "../skeletons/ProductListSkeleton";
import CatalogHeader from "./CatalogHeader";

const Catalog = () => {
  const isLoading = useAppSelector(selectIsProductsLoading);

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
