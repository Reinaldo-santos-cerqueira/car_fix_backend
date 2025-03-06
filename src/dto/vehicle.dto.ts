import {
    IsString,
    IsDate,
} from "class-validator";
import { Type } from "class-transformer";

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

  @Type(() => Date)
  @IsDate({ message: "Created at must be a valid date" })
      created_at: Date;

  @Type(() => Date)
  @IsDate({ message: "Updated at must be a valid date" })
      updated_at: Date;

  constructor(
      model: string,
      mark: string,
      plate: string,
      color: string,
      path_to_document: string,
      created_at: Date,
      updated_at: Date,
  ) {
      this.model = model;
      this.mark = mark;
      this.plate = plate;
      this.color = color;
      this.path_to_document = path_to_document;
      this.created_at = created_at;
      this.updated_at = updated_at;
  }
}