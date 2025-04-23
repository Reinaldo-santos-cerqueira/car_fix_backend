/* eslint-disable indent */
import {
    IsString,
} from "class-validator";

export class VehicleDto {
    @IsString({ message: "Model must be a string" })
    model: string;

    @IsString({ message: "Mark must be a string" })
    mark: string;

    @IsString({ message: "Plate must be a string" })
    plate: string;

    @IsString({ message: "Color must be a string" })
    color: string;

    @IsString({ message: "Path to document must be a string" })
    path_to_document: string;
    constructor(
        model: string,
        mark: string,
        plate: string,
        color: string,
        path_to_document: string,
    ) {
        this.model = model;
        this.mark = mark;
        this.plate = plate;
        this.color = color;
        this.path_to_document = path_to_document;
    }
}