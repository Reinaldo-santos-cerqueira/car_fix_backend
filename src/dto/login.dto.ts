/* eslint-disable indent */
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: "Please enter valid email" })
    email: string;
    @IsString({ message: "Please enter valid password" })
    password: string;
    @IsString({ message: "Please enter token" })
    token_phone?: string;
    @IsString({ message: "Please enter to type" })
    type: string;
    constructor(
        email: string,
        password: string,
        type: string,
        token_phone?: string,
    ) {
        this.email = email;
        this.password = password;
        this.token_phone = token_phone;
        this.type = type;
    }
}