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
  cart: { items: [] },
  onAdd: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  cartSummary: { details: [], subtotal: 0, total: 0, discount: 0, taxes: 0 },
  createCartSummary: () => {},
  resetCart: () => {},
  findProductByIdInCart: () => undefined,
});

const CartStore = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<CartType>({ items: [] });
  const [cartSummary, setCartSummary] = useState<CartSummaryType>({
    details: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    taxes: 0,
  });
  const { onAdd: addMessage } = useSiblingContext();

  const onAdd = (data: CartItemType) => {
    const index = cart.items.findIndex(({ item }) => {
      return item.id === data.item.id;
    });
    if (index !== -1) {
      return onUpdate(data.item.id, cart.items[index].quantity + data.quantity);
    }
    const items = [...cart.items, data];
    const newCart = { items };
    setCart(newCart);
    addMessage("item Added");
    saveCart(newCart);
  };

  const onRemove = (productId: number) => {
    const items = cart.items.filter((item) => item.item.id !== productId);
    const newCart = { items };
    setCart(newCart);
    addMessage("item Removed");
    saveCart(newCart);
  };

  const onUpdate = (productId: number, quantity: number) => {
    const index = cart.items.findIndex(({ item }) => {
      return item.id === productId;
    });
    const newCart = { ...cart };
    newCart.items[index].quantity = quantity;
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
    const { items } = cart;

    items.forEach((item) => {
      const cartItem = {
        unitPrice: item.item.price.amount,
        quantity: item.quantity,
        subTotal: item.item.price.amount * item.quantity,
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
    const cartIndex = cart.items.findIndex((product) => {
      return product.item.id === productId;
    });
    if (cartIndex !== -1) {
      return cart.items[cartIndex];
    }
  };

  const resetCart = () => {
    const newCart = { items: [] };
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
