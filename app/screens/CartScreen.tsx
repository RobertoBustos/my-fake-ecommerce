import Layout from "../components/Layout";
import Cart from "../components/cart/Cart";
import CartFooter from "../components/cart/CartFooter";
import LoadingScreen from "../components/common/LoadingScreen";
import { useAppSelector } from "../redux/hooks";
import { selectIsOrderLoading } from "../redux/order/selectors";

const CartScreen = () => {
  const isLoading = useAppSelector(selectIsOrderLoading);

  return (
    <Layout footerComponent={<CartFooter />}>
      {isLoading ? <LoadingScreen /> : <Cart />}
    </Layout>
  );
};

export default CartScreen;
