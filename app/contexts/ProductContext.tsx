import { ErrorLike } from "@apollo/client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import LoadingScreen from "../components/common/LoadingScreen";
import { ProductType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import useCart from "../hooks/useCart";
import useProduct from "../hooks/useProduct";
import { addItemToCart, renewCartId } from "../redux/cart/reducer";
import { selectCartId } from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectSelectedOrderId } from "../redux/order/selectors";
import { getErrorMessage, isNotFound } from "../utils/apiErrors";

export type ProdctContextType = {
  data: ProductType | undefined;
  cartId: string | undefined;
  orderId: string | undefined;
  isAdding: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  isAvailable: boolean;
  addProductToCart: () => void;
  reloadProduct: () => void;
  error: ErrorLike | undefined;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  setQuantity: (value: number) => void;
  footerText: string;
};

const ProductContext = createContext<ProdctContextType>({
  data: undefined,
  cartId: undefined,
  orderId: undefined,
  isAdding: false,
  isLoading: false,
  isDisabled: false,
  isAvailable: false,
  addProductToCart: () => {},
  reloadProduct: () => {},
  error: undefined,
  quantity: 1,
  minQuantity: 1,
  maxQuantity: 0,
  setQuantity: (value: number) => {},
  footerText: "",
});

export type ProductStorePropsType = PropsWithChildren & {
  productId: string;
};

const ProductStore = ({ children, productId }: ProductStorePropsType) => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const cartId = useAppSelector(selectCartId);
  const orderId = useAppSelector(selectSelectedOrderId);
  const [selectedQuantity, setQuantity] = useState<number>();
  const { data, isLoading, refetch, error } = useProduct({ id: productId });
  const { addProduct, isAdding } = useCart();
  const product = data ? data[0] : undefined;
  const isDisabled = cartId === "" || isAdding;
  const minQuantity = product?.purchaseLimits.min || 1;
  const maxQuantity = product
    ? Math.min(product.purchaseLimits.max, product.stock)
    : 0;
  const isAvailable = maxQuantity >= minQuantity;
  // Starts at the minimum, and reloading the product can change the limits
  const quantity = Math.max(
    minQuantity,
    Math.min(selectedQuantity ?? minQuantity, maxQuantity)
  );
  const footerText = !isAvailable
    ? "Go Back"
    : orderId
    ? "Add to Order"
    : "Add to Cart";

  const addProductToCart = () => {
    if (!product || !isAvailable) {
      navigation.goBack();
      return;
    }
    const addTo = (id: string) =>
      addProduct({
        cartId: id,
        productId: product.id,
        quantity: quantity,
        orderId: orderId || null,
      });
    addTo(cartId)
      .catch(async (error) => {
        // The saved cart can't be used: the product goes to a new one
        if (orderId || !isNotFound(error, "cartId")) throw error;
        const renewed = await dispatch(renewCartId());
        // The reducer already showed why it failed
        if (!renewCartId.fulfilled.match(renewed)) return;
        return addTo(renewed.payload);
      })
      .then((data) => {
        if (!data) return;
        dispatch(addItemToCart(data));
        navigation.goBack();
      })
      // The real stock and the purchase limits are checked here, the catalog stock is a reference only
      .catch((error) => Alert.alert(getErrorMessage(error)));
  };

  const reloadProduct = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ProductContext.Provider
      value={{
        data: product,
        cartId,
        orderId,
        isAdding,
        isLoading,
        isDisabled,
        isAvailable,
        addProductToCart,
        reloadProduct,
        error,
        quantity,
        minQuantity,
        maxQuantity,
        setQuantity,
        footerText,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};

export default ProductStore;
