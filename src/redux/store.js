import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productsReducer";
import { userReducer } from "./reducers/usersReducer";

export const store=configureStore({
    reducer:{
        productReducer,
        userReducer
    },
    middleware:[...getDefaultMiddleware({serializableCheck: false})]
})