import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from "redux-persist";
import apiReducer, { apiThunks } from "./api"
import { useDispatch } from "react-redux";

const persistedAuthReducer = persistReducer({
    key: 'auth',
    storage,
}, authReducer)

const persistedApiReducer = persistReducer({
    key: 'api',
    storage,
}, apiReducer)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

//export default store

export const store = configureStore({
    reducer: { auth: persistedAuthReducer, api: persistedApiReducer }, //persistedApiReducer
    //devTools: process.env.NODE_ENV !== 'production',
    //middleware: [thunk]
})

export const persistor = persistStore(store)