import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/reducer";
import orderReducer from "./order/reducer";
import { AppStore, PreloadState } from "./types";

const rootReducer = combineReducers({
    cart: cartReducer,
    order: orderReducer
})

const createEnhancers = (getDefaultEnhancers: any) => {
    if (__DEV__) {
        const reactotron = require("../../ReactotronConfig").default
        return getDefaultEnhancers().concat(reactotron.createEnhancer())
    } else {
        return getDefaultEnhancers()
    }
}

const setupStore = (preloadedState?: PreloadState) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        devTools: true,
        enhancers: createEnhancers,
    })
}

const store: AppStore = setupStore()

export default store