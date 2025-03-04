import { useEffect } from "react";
import Layout from "../components/Layout";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import { useCartContext } from "../contexts/CartContext";
import { useAppNavigation } from "../hooks/useAppNavigation";

const ConfirmationScreen = () => {
  const navigation = useAppNavigation();
  const { resetCart } = useCartContext();

  const handleReturnHome = () => {
    resetCart();
    navigation.reset({ index: 0, routes: [{ name: "Products" }] });
  };

  useEffect(() => {
    const resetAction = setTimeout(() => {
      handleReturnHome();
    }, 10000);

    return () => {
      clearTimeout(resetAction);
    };
  }, []);

  return (
    <Layout footerComponent={<ConfirmationFooter onClick={handleReturnHome} />}>
      <Confirmation />
    </Layout>
  );
};

export default ConfirmationScreen;
