import { ProductCardSkeleton } from "./ProductCardSkeleton";

const ProductListSkeleton = () => {
  return Array.from({ length: 8 }).map((_, index) => {
    return <ProductCardSkeleton key={index} />;
  });
};

export default ProductListSkeleton;
