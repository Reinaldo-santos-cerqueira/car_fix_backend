import {  IsOptional, IsString } from "class-validator";

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
    
    constructor(
        neighborhood: string,
        street: string,
        number: string,
        city: string,
        state: string,
        cep: string,
        complement?: string
    ) {
        this.neighborhood = neighborhood;
        this.street = street;
        this.number = number;
        this.city = city;
        this.state = state;
        this.cep = cep;
        this.complement = complement;
    }
}
