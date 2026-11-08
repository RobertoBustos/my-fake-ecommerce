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

// The cart belongs to the signed in user, so it is loaded once the user is known
const useInitialFetch = (userId: string | undefined) => {
    const dispatch = useAppDispatch();
    const { fetchCart } = useCart();

    useEffect(() => {
        if (!userId) return
        dispatch(setCartId(userId))
            .unwrap()
            .then((cartId) => fetchCart(cartId))
            .then((items) => {
                if (items.length === 0) return;
                dispatch(setCartFromOrder(items));
            })
            .catch((error) => console.error(error))
            .finally(() => SplashScreen.hide());

        return () => { };
    }, [dispatch, fetchCart, userId]);
}

export default useInitialFetch
