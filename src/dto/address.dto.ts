import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class AddressDto {
    @IsString({ message: "Neighborhood must be a string" })
        neighborhood: string;
  
    @IsString({ message: "Street must be a string" })
        street: string;
  
    @IsString({ message: "Number must be a string" })
        number: string;
  
    @IsString({ message: "City must be a string" })
        city: string;
  
    @IsString({ message: "State must be a string" })
        state: string;
  
    @IsString({ message: "CEP must be a string" })
        cep: string;
  
    @IsOptional()
    @IsString({ message: "Complement must be a string" })
        complement?: string;
    
    @Type(() => Date)
    @IsDate({ message: "Created date must be a valid date" })
        created_at: Date;
    
    @Type(() => Date)    
    @IsDate({ message: "Updated date must be a valid date" })
        updated_at: Date;
    
    constructor(
        neighborhood: string,
        street: string,
        number: string,
        city: string,
        state: string,
        cep: string,
        created_at: Date,
        updated_at: Date,
        complement?: string
    ) {
        this.neighborhood = neighborhood;
        this.street = street;
        this.number = number;
        this.city = city;
        this.state = state;
        this.cep = cep;
        this.complement = complement;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
