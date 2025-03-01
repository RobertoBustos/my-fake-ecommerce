import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartItemType, CartType } from "../constants/types";
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
};

export type CartStoreType = {
  children: ReactNode;
};

const CartContext = createContext<CartContextType>({
  cart: { items: [] },
  onAdd: () => {},
  onUpdate: () => {},
  onRemove: () => {},
});

const CartStore = ({ children }: CartStoreType) => {
  const [cart, setCart] = useState<CartType>({ items: [] });
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

  useEffect(() => {
    fetchCart();
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
    <CartContext.Provider value={{ cart, onAdd, onRemove, onUpdate }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};

export default CartStore;
