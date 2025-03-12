import { useCallback } from "react";
import { useOrderContext } from "../../contexts/OrderContext";
import useAppNavigation from "../../hooks/useAppNavigation";
import { resetCart } from "../../redux/cart/reducer";
import { useAppDispatch } from "../../redux/hooks";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const ConfirmationFooter = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();
  const { isLoading } = useOrderContext();

  const handleReturnHome = useCallback(() => {
    dispatch(resetCart());
    navigation.reset({ index: 0, routes: [{ name: "Products" }] });
  }, [dispatch, navigation]);

  return (
    <CustomFooter>
      <FooterButton
        text={"Return To Home"}
        onPress={handleReturnHome}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </CustomFooter>
  );
};

export default ConfirmationFooter;
