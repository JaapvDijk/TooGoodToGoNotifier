import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { authSelectors, authThunks } from "../redux/auth";
import { useSelector } from "react-redux";
import { store } from "../redux/store";

//Use GoogleLogin to get jwt id token
//then send token to server to get jwt access token (only valid for this app)

const Login = () => {
    const logout = () => {
        store.dispatch(authThunks.logout())
    }

    const onError = () => {
        alert("Login failed");
    };

    const login = (response: CredentialResponse) => {
        const tokenBlob = new Blob([JSON.stringify({ token: response.credential }, null, 2)], { type: 'application/json' });
        console.log('received google token, req from api')
        //TODO: url
        fetch("http://localhost:5000/api/User/google", {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors'
        })
        .then(resp => {
            resp.json().then(user => {
                store.dispatch(authThunks.login(user.token));
            });
        })
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
                <GoogleLogin onSuccess={login} onError={onError}/>
            </>
        );

    return (
        <>
            {content}
        </>
    );
}

export default Login;
