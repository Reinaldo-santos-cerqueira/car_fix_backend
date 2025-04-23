/* eslint-disable indent */

import { IsEmail } from "class-validator";

export class SendTokenDto {
    @IsEmail({}, { message: "Please enter valid email" })
    email: string;
    constructor(
        email: string,
    ) {
        this.email = email;
    }
}