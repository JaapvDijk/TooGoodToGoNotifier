import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import store, { RootState } from "./store";
import { Api } from "../apiClient/Api";
import { GoogleJwtPayload } from "../types/googleJwt";
import { jwtDecode } from "jwt-decode";

type SliceState = {
    api: Api,
}

//function UserIsValid(token: string) {
//    console.log("the token is " + token);

//    var decodedToken = jwtDecode<GoogleJwtPayload>(token); //TODO: first, GoogleJwtPayload invalid type. need type from own API.
//    if (decodedToken.exp! > new Date().getTime() / 1000) return true;
//    else return false;
//}

const myCustomFetch: WindowOrWorkerGlobalScope['fetch'] = async (input: RequestInfo, init?: RequestInit) => {
    const customHeaders = {
        'Authorization': `Bearer ${store.getState().auth.token}`,
    };

    if (init && init.headers) {
        init.headers = new Headers(init.headers);
        Object.entries(customHeaders).forEach(([key, value]) => {
            (init!.headers as Headers).append(key, value);
        });
    } else {
        init = { ...init, headers: customHeaders };
    }

    return fetch(input, init);
};

const initialState: SliceState = {
    api: new Api({
        baseUrl: 'http://localhost:5000',
        customFetch: myCustomFetch
    })
}

const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {
        setApi: (state, action: PayloadAction<Api>) => {
            state.api = action.payload;
        },
    },
});

export const { setApi } = apiSlice.actions;

const apiState = (state: RootState) => state.api;

const selectApi = createSelector(apiState, (state) => {
    return state.api;
});

export default apiSlice.reducer;

export const apiThunks = {
    ...apiSlice.actions
};

export const apiSelectors = {
    selectApi,
};