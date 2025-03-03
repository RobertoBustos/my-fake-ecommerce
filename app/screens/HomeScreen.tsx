import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import ProductList from "../components/ProductList";
import ProductListSkeleton from "../components/skeletons/ProductListSkeleton";
import { useCartContext } from "../contexts/CartContext";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useProducts } from "../hooks/useProducts";

const HomeScreen = () => {
  const navigation = useAppNavigation();
  const { isLoading, products } = useProducts();
  const { cart, createCartSummary } = useCartContext();

  const renderFooter = () => {
    return cart && cart?.items.length > 0 ? (
      <FooterButton
        text={"View Cart"}
        onPress={() => {
          createCartSummary();
          navigation.navigate("Cart");
        }}
      />
    ) : null;
  };

  if (isLoading) {
    return (
      <Layout>
        <ProductListSkeleton />
      </Layout>
    );
  }

  return (
    <Layout footerComponent={renderFooter()}>
      <ProductList products={products} />
    </Layout>
  );
};

export default HomeScreen;
