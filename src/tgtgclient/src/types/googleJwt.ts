import { JwtPayload } from "jwt-decode";

export interface GoogleJwtPayload extends JwtPayload {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
}