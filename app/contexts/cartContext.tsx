import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartItemType, CartSummaryType, CartType } from "../constants/types";
import {
  getFromAsyncStorage,
  saveToAsyncStorage,
} from "../utils/saveToAsyncStorage";
import { useSiblingContext } from "./SiblingContext";

export type CartContextType = {
  cart: CartType;
  onAdd: (data: CartItemType) => void;
  onUpdate: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  cartSummary: CartSummaryType;
  createCartSummary: () => void;
  resetCart: () => void;
  findProductByIdInCart: (productId: number) => CartItemType | undefined;
};

const CartContext = createContext<CartContextType>({
  cart: [],
  onAdd: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  cartSummary: { details: [], subtotal: 0, total: 0, discount: 0, taxes: 0 },
  createCartSummary: () => {},
  resetCart: () => {},
  findProductByIdInCart: () => undefined,
});

const CartStore = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummaryType>({
    details: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    taxes: 0,
  });
  const { onAdd: addMessage } = useSiblingContext();

  const onAdd = (data: CartItemType) => {
    const index = cart.findIndex((item) => {
      return item.id === data.id;
    });
    if (index !== -1 && data.quantity) {
      const newQuantity = cart[index].quantity
        ? cart[index].quantity + data.quantity
        : data.quantity;
      return onUpdate(data.id, newQuantity);
    }
    const newCart = [...cart, data];
    setCart(newCart);
    addMessage("item Added");
    saveCart(newCart);
  };

  const onRemove = (productId: number) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    addMessage("item Removed");
    saveCart(newCart);
  };

  const onUpdate = (productId: number, quantity: number) => {
    const index = cart.findIndex((item) => {
      return item.id === productId;
    });
    const newCart = { ...cart };
    newCart[index].quantity = quantity;
    setCart(newCart);
    addMessage("item Updated");
    saveCart(newCart);
  };

  const createCartSummary = () => {
    const cartSummary: CartSummaryType = {
      details: [],
      subtotal: 0,
      total: 0,
      discount: 0,
      taxes: 0,
    };

    cart.forEach((item) => {
      const cartItem = {
        unitPrice: item.price.amount,
        quantity: item.quantity,
        subTotal: item.price.amount * item.quantity,
      };
      cartSummary.details = [...cartSummary.details, cartItem];
      cartSummary.subtotal += cartItem.subTotal;
      cartSummary.taxes += Math.floor(cartItem.subTotal * 0.16);
    });

    cartSummary.total =
      cartSummary.subtotal + cartSummary.taxes - cartSummary.discount;

    setCartSummary(cartSummary);
  };

  const findProductByIdInCart = (
    productId: number
  ): CartItemType | undefined => {
    const index = cart.findIndex((item) => {
      return item.id === productId;
    });
    if (index !== -1) {
      return cart[index];
    }
  };

  const resetCart = () => {
    const newCart: CartType = [];
    setCart(newCart);
    saveCart(newCart);
    setCartSummary({
      details: [],
      subtotal: 0,
      total: 0,
      discount: 0,
      taxes: 0,
    });
  };

  useEffect(() => {
    fetchCart();
    return () => {};
  }, []);

  const fetchCart = async () => {
    getFromAsyncStorage("shoppingCart").then((response) => {
      if (response !== null) {
        setCart(JSON.parse(response));
      }
    });
  };

  const saveCart = async (cart: CartType) => {
    saveToAsyncStorage("shoppingCart", JSON.stringify(cart));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        onAdd,
        onRemove,
        onUpdate,
        cartSummary,
        createCartSummary,
        resetCart,
        findProductByIdInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};

export default CartStore;
