import { IsEmail, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsEmail({},{message: "Please enter valid email"})
        email: string;
    @IsString({ message: "Please enter valid password" })
        password: string;
    @IsOptional()
    @IsString({ message: "Please enter valid token" })
        token_phone?: string;
    constructor(
        email: string,
        password: string,
        token_phone?: string 
    ) {
        this.email = email;
        this.password = password;
        this.token_phone = token_phone;
    }
}