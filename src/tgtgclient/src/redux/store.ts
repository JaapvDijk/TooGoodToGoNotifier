import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import apiReducer from "./api";

const store = configureStore({
    reducer: {
        auth: authReducer,
        api: apiReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store