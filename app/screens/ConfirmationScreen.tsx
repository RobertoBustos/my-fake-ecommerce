import { useEffect } from "react";
import { Text } from "react-native";
import Layout from "../components/Layout";
import { useCartContext } from "../contexts/CartContext";
import { useAppNavigation } from "../hooks/useAppNavigation";

const ConfirmationScreen = () => {
  const { resetCart } = useCartContext();
  const navigation = useAppNavigation();

  useEffect(() => {
    setTimeout(() => {
      resetCart();
      navigation.reset({ index: 0, routes: [{ name: "Products" }] });
    }, 10000);

    return () => {};
  }, []);

  return (
    <Layout>
      <Text>CONFIRMATION SCREEN</Text>
    </Layout>
  );
};

export default ConfirmationScreen;
