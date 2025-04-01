import { ApolloError } from "@apollo/client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { ProductType } from "../constants/types";
import useAppNavigation from "../hooks/useAppNavigation";
import useCart from "../hooks/useCart";
import useProduct from "../hooks/useProduct";
import { addItemToCart } from "../redux/cart/reducer";
import { selectCartId } from "../redux/cart/selectors";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectSelectedOrderId } from "../redux/order/selectors";

export type ProdctContextType = {
  data: ProductType | undefined;
  cartId: string | undefined;
  orderId: string | undefined;
  isAdding: boolean;
  isLoading: boolean;
  addProductToCart: () => void;
  reloadProduct: () => void;
  error: ApolloError | undefined;
  quantity: number;
  setQuantity: (value: number) => void;
};

const ProductContext = createContext<ProdctContextType>({
  data: undefined,
  cartId: undefined,
  orderId: undefined,
  isAdding: false,
  isLoading: false,
  addProductToCart: () => {},
  reloadProduct: () => {},
  error: undefined,
  quantity: 1,
  setQuantity: (value: number) => {},
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

  const addProductToCart = () => {
    if (!data) return;
    addProduct({
      cartId: cartId,
      productId: data.id,
      quantity: quantity,
      orderId: orderId || null,
    }).then((data) => {
      dispatch(addItemToCart(data));
      navigation.goBack();
    });
  };

  const reloadProduct = () => {
    refetch();
  };

  return (
    <ProductContext.Provider
      value={{
        data,
        cartId,
        orderId,
        isAdding,
        isLoading,
        addProductToCart,
        reloadProduct,
        error,
        quantity,
        setQuantity,
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
