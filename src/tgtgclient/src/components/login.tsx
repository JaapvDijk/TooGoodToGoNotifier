import { CredentialResponse, GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { authSelectors, authSlice, authThunks } from "../redux/auth";
import { GoogleJwtPayload } from "../types/googleJwt";
import { useSelector } from "react-redux";
import store from "../redux/store";

//Use GoogleLogin to get jwt id token
//then send token to server to get jwt access token (only valid for this app)

const Login = () => {
    const isLoggedIn = useSelector(authSelectors.selectIsAuthenticated);
    const rToken = useSelector(authSelectors.selectToken);

    const logout = () => {
        store.dispatch(authThunks.logout())
    }

    const onError = () => {
        alert("Login failed");
    };

    //Received an ID token from google.
    //Exchange it for a token from the server..
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

                console.log('token: ' + user.token);
                console.log('redux logged in: ' + isLoggedIn);
                console.log('redux token: ' + rToken);
            });
        })
    };

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

//TODO: use in http client
export function UserIsValid(token: any) {
    console.log("the token is " + token.user);
    if (token.isAuthenticated) {
        var decodedToken = jwtDecode<GoogleJwtPayload>(token.user); //TODO: GoogleJwtPayload invalid type. need type from own API.
        if (decodedToken.exp! > new Date().getTime() / 1000) return true;
        else return false;
    }
    return false;
}

