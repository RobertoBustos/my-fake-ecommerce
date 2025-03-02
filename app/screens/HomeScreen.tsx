import { NavigationProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import FooterButton from "../components/FooterButton";
import Layout from "../components/Layout";
import ProductList from "../components/ProductList";
import ProductListSkeleton from "../components/skeletons/ProductListSkeleton";
import { RootStackParamList } from "../constants/types";
import { useCartContext } from "../contexts/CartContext";
import { useProducts } from "../hooks/useProducts";

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isLoading, response } = useProducts();
  const { cart } = useCartContext();

  const renderFooter = () => {
    return cart && cart?.items.length > 0 ? (
      <FooterButton
        text={"View Cart"}
        onPress={() => navigation.navigate("Cart")}
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
      <ProductList products={response} />
    </Layout>
  );
};

export default HomeScreen;
