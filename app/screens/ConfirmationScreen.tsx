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
      navigation.navigate("Products");
    }, 30000);
  }, []);

  return (
    <Layout>
      <Text>CONFIRMATION SCREEN</Text>
    </Layout>
  );
};

export default ConfirmationScreen;
