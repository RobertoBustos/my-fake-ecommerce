import { ApolloError } from "@apollo/client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import LoadingScreen from "../components/common/LoadingScreen";
import { ProductType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import useCart from "../hooks/useCart";
import useProduct from "../hooks/useProduct";
import { addItemToCart } from "../redux/cart/reducer";
import { selectCartId } from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectSelectedOrderId } from "../redux/order/selectors";
import { getErrorMessage } from "../utils/apiErrors";

export type ProdctContextType = {
  data: ProductType | undefined;
  cartId: string | undefined;
  orderId: string | undefined;
  isAdding: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  addProductToCart: () => void;
  reloadProduct: () => void;
  error: ApolloError | undefined;
  quantity: number;
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
  addProductToCart: () => {},
  reloadProduct: () => {},
  error: undefined,
  quantity: 1,
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
  const [quantity, setQuantity] = useState<number>(1);
  const { data, isLoading, refetch, error } = useProduct({
    filter: { field: "id", value: productId },
  });
  const { addProduct, isAdding } = useCart();
  const product = data ? data[0] : undefined;
  const isDisabled = cartId === "" || isAdding;
  const footerText =
    !product || product.stock === 0
      ? "Go Back"
      : orderId
      ? "Add to Order"
      : "Add to Cart";

  const addProductToCart = () => {
    if (!product || product.stock === 0) {
      navigation.goBack();
      return;
    }
    addProduct({
      cartId: cartId,
      productId: product.id,
      quantity: quantity,
      orderId: orderId || null,
    })
      .then((data) => {
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
        addProductToCart,
        reloadProduct,
        error,
        quantity,
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
