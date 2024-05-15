import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { jwtDecode } from "jwt-decode";
import { AccesJwtPayload } from "../types/accesJwtPayload";

type SliceState = {
    token: string,
    isAuthenticated: boolean,
}

const initialState: SliceState = {
    token: "",
    isAuthenticated: false,
}

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
        login: (state, action) => { //PayloadAction<SliceState>
            state.token = action.payload;
            state.isAuthenticated = true;
		},
		logout: (state) => {
            state.token = "";
            state.isAuthenticated = false;
        }

	}
});

const authState = (state: RootState) => state.auth;

const selectToken = createSelector(authState, (state) => state.token);
const selectTokenPayload = createSelector(authState, (state) => state.isAuthenticated ? jwtDecode<AccesJwtPayload>(state.token) : null);
const selectIsAuthenticated = createSelector(authState, (state) => state.isAuthenticated);

export default authSlice.reducer;

export const authThunks = {
  ...authSlice.actions
};

export const authSelectors = {
    selectToken,
    selectTokenPayload,
    selectIsAuthenticated,
};