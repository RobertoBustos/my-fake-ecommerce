import { useCallback } from "react";
import Layout from "../components/Layout";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import { useCartContext } from "../contexts/CartContext";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useAppDispatch } from "../redux/hooks";
import { clearOrderCompleted } from "../redux/order/reducer";

const ConfirmationScreen = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { resetCart } = useCartContext();

  const handleReturnHome = useCallback(() => {
    resetCart();
    dispatch(clearOrderCompleted());
    navigation.reset({ index: 0, routes: [{ name: "Products" }] });
  }, [dispatch, navigation, resetCart]);

  /*   useEffect(() => {
    const resetAction = setTimeout(() => {
      handleReturnHome();
    }, 10000);

    return () => {
      clearTimeout(resetAction);
    };
  }, [handleReturnHome]); */

  return (
    <Layout footerComponent={<ConfirmationFooter onClick={handleReturnHome} />}>
      <Confirmation />
    </Layout>
  );
};

export default ConfirmationScreen;
