import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { authSelectors, authThunks } from "../redux/auth";
import { useSelector } from "react-redux";
import { store } from "../redux/store";
import { ApiClient } from "../apiClient/ApiClient";

const Login = () => {
    const api = ApiClient.getNoAuthInstance();

    const logout = () => {
        store.dispatch(authThunks.logout())
    }

    const login = async (response: CredentialResponse) => {
        await api.userGoogleCreate({ token: response.credential })
                .then((response) => response.json())
                .then((data) => store.dispatch(authThunks.login(data.token)));   
    };

    const isLoggedIn = useSelector(authSelectors.selectIsAuthenticated);
    let content = isLoggedIn ?
        (
            <>
                <input type='button' value='Logout' onClick={logout} />
            </>
        ) :
        (
            <>
                <GoogleLogin onSuccess={login} />
            </>
        );

    return (
        <>
            {content}
        </>
    );
}

export default Login;
