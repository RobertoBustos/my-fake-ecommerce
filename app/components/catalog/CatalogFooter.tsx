import { useCartContext } from "@/app/contexts/CartContext";
import { useAppNavigation } from "@/app/hooks/useAppNavigation";
import FooterButton from "../FooterButton";
import CustomFooter from "../common/CustomFooter";

const CatalogFooter = () => {
  const navigation = useAppNavigation();
  const { cart, createCartSummary } = useCartContext();

  return cart && cart.length > 0 ? (
    <CustomFooter>
      <FooterButton
        text={"View Cart"}
        onPress={() => {
          createCartSummary();
          navigation.navigate("Cart");
        }}
      />
    </CustomFooter>
  ) : null;
};

export default CatalogFooter;
