import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { orderReducer } from "./order/reducer";
import { AppStore, PreloadState } from "./types";

export const rootReducer = combineReducers({
    order: orderReducer
})

export const setupStore = (preloadedState?: PreloadState) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        devTools: true,
    })
}

export const store: AppStore = setupStore()