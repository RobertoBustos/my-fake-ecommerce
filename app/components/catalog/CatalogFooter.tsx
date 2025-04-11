import useAppNavigation from "../../hooks/useAppNavigation";
import { selectIsCartEmpty } from "../../redux/cart/selectors";
import { useAppSelector } from "../../redux/hooks";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CatalogFooter = () => {
  const navigation = useAppNavigation();
  const isCartEmpty = useAppSelector(selectIsCartEmpty);

  if (isCartEmpty) {
    return null;
  }

  return (
    <CustomFooter>
      <FooterButton
        text={"View Cart"}
        onPress={() => {
          navigation.navigate("Cart");
        }}
        testID="CatalogScreen.Footer"
      />
    </CustomFooter>
  );
};

export default CatalogFooter;
