import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { setCartFromOrder, setCartId } from "../redux/cart/reducer";
import { useAppDispatch } from "../redux/hooks";
import useCart from "./useCart";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 2000,
    fade: true,
});

// The API needs a user, so the cart is loaded once the session exists
const useInitialFetch = (userId: string | undefined) => {
    const dispatch = useAppDispatch();
    const { fetchCart } = useCart();

    useEffect(() => {
        if (!userId) return
        dispatch(setCartId())
            .unwrap()
            .then((cartId) => {
                fetchCart(cartId).then((data) => {
                    SplashScreen.hide();
                    if (data.data.carts.length === 0) return;
                    dispatch(setCartFromOrder(data.data.carts));
                });
            });

        return () => { };
    }, [dispatch, fetchCart, userId]);
}

export default useInitialFetch