import { useCallback } from "react";
import Layout from "../components/Layout";
import Confirmation from "../components/confirmation/Confirmation";
import ConfirmationFooter from "../components/confirmation/ConfirmationFooter";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { resetCart } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";
import { clearOrderCompleted } from "../redux/order/reducer";

const ConfirmationScreen = ({ route }: any) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleReturnHome = useCallback(() => {
    dispatch(resetCart());
    dispatch(clearOrderCompleted());
    navigation.reset({ index: 0, routes: [{ name: "Products" }] });
  }, [dispatch, navigation]);

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
      <Confirmation orderId={route.params.orderId} />
    </Layout>
  );
};

export default ConfirmationScreen;
