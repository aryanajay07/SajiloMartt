import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./Features/auth/authSlice";
import favoritesReducer from "../redux/Features/favorites/favoriteSlice";
import cartSliceReducer from "../redux/Features/cart/cartSlice";
import shopReducer from "../redux/Features/shop/shopSlice";
import { getFavoritesFromLocalStorage } from "../utils/localStorage";

const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        favorites: favoritesReducer,
        cart: cartSliceReducer,
        shop: shopReducer,
    },

    preloadedState: {
        favorites: initialFavorites,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

setupListeners(store.dispatch);
export default store;
