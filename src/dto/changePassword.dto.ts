import { IsEmail, IsString, Max, Min } from "class-validator";

export class ChangePasswordDto {
    @IsEmail({},{message: "Please enter valid email"})
        email: string;
    @IsString({ message: "Please enter password" })
        password: string;
    
    @Min(6, { message: "Please enter valid token" })
    @Max(6, {message: "Please enter valid token"})
    @IsString({ message: "Please enter valid token" })
        token: string;
    constructor(
        email: string,
        password: string,
        token: string
    ) {
        this.email = email;
        this.token = token;
        this.password = password;
    }
}