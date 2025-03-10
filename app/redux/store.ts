import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/reducer";
import orderReducer from "./order/reducer";
import { AppStore, PreloadState } from "./types";

const rootReducer = combineReducers({
    cart: cartReducer,
    order: orderReducer
})

const setupStore = (preloadedState?: PreloadState) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        devTools: true,
    })
}

const store: AppStore = setupStore()

export default store