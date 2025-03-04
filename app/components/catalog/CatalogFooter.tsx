import { useCartContext } from "@/app/contexts/CartContext";
import { useAppNavigation } from "@/app/hooks/useAppNavigation";
import FooterButton from "../FooterButton";

const CatalogFooter = () => {
  const navigation = useAppNavigation();
  const { cart, createCartSummary } = useCartContext();

  return cart && cart?.items.length > 0 ? (
    <FooterButton
      text={"View Cart"}
      onPress={() => {
        createCartSummary();
        navigation.navigate("Cart");
      }}
    />
  ) : null;
};

export default CatalogFooter;
