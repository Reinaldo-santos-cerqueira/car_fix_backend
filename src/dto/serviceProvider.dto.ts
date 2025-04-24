
/* eslint-disable indent */

import {
    IsString,
    ValidateNested,
    IsArray,
    ArrayNotEmpty,
    IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { UserDto } from "./user.dto";

export class ServiceProviderDto {
    @ValidateNested({ message: "Data user is required" })
    @Type(() => UserDto)
    user_dto: UserDto;
    @IsArray({ message: "Services is required" })
    @ArrayNotEmpty({ message: "Services cannot be empty" })
    services_id: string[];
    @IsString({ message: "Services is required" })
    cnh: string;
    @IsOptional()
    @IsString({ message: "Image cnh is required" })
    path_to_image_cnh?: string;

    constructor(
        user_dto: UserDto,
        services_id: string[],
        cnh: string,
        path_to_image_cnh?: string,
    ) {
        this.user_dto = user_dto;
        this.services_id = services_id;
        this.cnh = cnh;
        this.path_to_image_cnh = path_to_image_cnh;
    }
}
