import {
    IsEmail,
    IsOptional,
    IsString,
    IsDate,
    ValidateNested,
} from "class-validator";
import { AddressDto } from "./address.dto";
import { Type } from "class-transformer";
import { VehicleDto } from "./vehicle.dto";

export class UserDto {
    @IsString({ message: "Full name must be a string" })
        full_name: string;

    @IsString({ message: "Phone number must be a string" })
        phone_number: string;

    @IsEmail({}, { message: "Email must be a valid email address" })
        email: string;

    @IsString({ message: "Identifier must be a string" })
        identifier: string;

    @IsString({ message: "Password must be a string" })
        password: string;

    @IsOptional()
    @IsString({ message: "Token phone must be a string" })
        token_phone?: string;

    @IsOptional()
    @IsString({ message: "Token password change must be a string" })
        token_password_change?: string;

    @IsOptional()
    @IsString({ message: "Type must be a string" })
        type?: string;

    @ValidateNested({ message: "Address must be a valid address" })
    @Type(() => AddressDto)
        address: AddressDto;

    @ValidateNested({ message: "Vehicle must be a valid address" })
    @Type(() => VehicleDto)
        vehicle: VehicleDto;    

    @IsOptional()
    @IsString({ message: "Role must be a string" })
        role?: string;

    @Type(() => Date)
    @IsDate({ message: "Created at must be a valid date" })
        created_at: Date;

    @Type(() => Date)
    @IsDate({ message: "Updated at must be a valid date" })
        updated_at: Date;

    constructor(
        full_name: string,
        phone_number: string,
        email: string,
        identifier: string,
        password: string,
        created_at: Date,
        updated_at: Date,
        address: AddressDto,
        vehicle: VehicleDto,
        token_phone?: string,
        token_password_change?: string,
        type?: string,
        role?: string
    ) {
        this.full_name = full_name;
        this.phone_number = phone_number;
        this.email = email;
        this.identifier = identifier;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.token_phone = token_phone;
        this.token_password_change = token_password_change;
        this.type = type;
        this.address = address;
        this.role = role;
        this.vehicle = vehicle;
    }
}
