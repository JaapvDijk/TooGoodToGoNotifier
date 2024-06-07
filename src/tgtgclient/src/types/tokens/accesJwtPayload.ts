import { JwtPayload } from "jwt-decode";

export interface AccesJwtPayload extends JwtPayload {
    email: string;
    picture: string;
    firstName: string;
}