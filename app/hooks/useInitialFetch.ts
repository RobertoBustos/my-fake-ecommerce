import { useEffect } from "react";
import { setCartFromOrder, setCartId } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";
import useCart from "./useCart";

const useInitialFetch = () => {
    const dispatch = useAppDispatch();
    const { fetchCart } = useCart();

    useEffect(() => {
        dispatch(setCartId())
            .unwrap()
            .then((cartId) => {
                fetchCart(cartId).then((data) => {
                    if (data.data.carts.length === 0) return;
                    dispatch(setCartFromOrder(data.data.carts));
                });
            });

        return () => { };
    }, [dispatch, fetchCart]);
}

export default useInitialFetch