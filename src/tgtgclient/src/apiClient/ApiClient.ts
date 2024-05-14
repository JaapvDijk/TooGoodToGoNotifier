import { jwtDecode } from "jwt-decode";
import { store } from "../redux/store";
import { Api } from "./Api";
import { authThunks } from "../redux/auth";
import { AccesJwtPayload } from "../types/accesJwtPayload";

const authenticatedFetch: WindowOrWorkerGlobalScope['fetch'] = async (input: RequestInfo, init?: RequestInit) => {
    const token = store.getState().auth.token;

    if (UserIsValid(token)) {
        const customHeaders = {
            'Authorization': `Bearer ${token}`,
        };

        if (init && init.headers) {
            init.headers = new Headers(init.headers);
            Object.entries(customHeaders).forEach(([key, value]) => {
                (init!.headers as Headers).append(key, value);
            });
        } else {
            init = { ...init, headers: customHeaders };
        }
    }
    else {
        store.dispatch(authThunks.logout());
    }

    return fetch(input, init);
};

//Singleton
export class ApiClient extends Api{
    private static instance: ApiClient;
    private static noAuthInstance: ApiClient;

    private constructor() { super() }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Api({
            baseUrl: 'http://localhost:5000',
            customFetch: authenticatedFetch
        });

        return this.instance;
    }

    static getNoAuthInstance() {
        if (this.noAuthInstance) {
            return this.noAuthInstance;
        }
        this.noAuthInstance = new Api({
            baseUrl: 'http://localhost:5000',
        });

        return this.noAuthInstance;
    }
}

export function UserIsValid(token: string) {
    var decodedToken = jwtDecode<AccesJwtPayload>(token);

    return decodedToken.exp! > new Date().getTime() / 1000;
}
