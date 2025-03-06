import { UserDto } from "@dto";
import { CustomException } from "@exceptions";
import { Prisma } from "@prisma/client";
import { UserRepositories } from "@repositories";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export class UserService {
    repository: UserRepositories;
    constructor(){
        this.repository = new UserRepositories();
    }
    async save(userDto: UserDto, file: Express.Multer.File | undefined): Promise<Prisma.UserCreateInput> { 
        if(!file){
            throw new CustomException("Image is required", 400);
        }
        try {
            await this.findUserByIdentifierOrEmail(userDto.identifier, userDto.email);
            userDto.vehicle.path_to_document = file.path;
            const user: Prisma.UserCreateInput = await this.createUserCreateInput(userDto);    
                
            return await this.repository.save(user);   
        } catch (error) {
            if(error instanceof CustomException ){
                this.deleteImage(file);
                throw new CustomException(error.message, error.statusCode);
            }
            throw new CustomException(error + "", 500);
        }

    }

    private async encryptPassword(password: string):Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private async createUserCreateInput(userDto: UserDto): Promise<Prisma.UserCreateInput> {
        return {
            full_name: userDto.full_name,
            phone_number: userDto.phone_number,
            email: userDto.email,
            identifier: userDto.identifier,
            password: await this.encryptPassword(userDto.password),
            created_at: userDto.created_at,
            updated_at: userDto.updated_at,
            token_phone: userDto.token_phone,
            token_password_change: userDto.token_password_change,
            type: userDto.type,
            address: {
                create: {
                    created_at: userDto.address.created_at,
                    updated_at: userDto.address.updated_at,
                    neighborhood: userDto.address.neighborhood,
                    street: userDto.address.street,
                    number: userDto.address.number,
                    city: userDto.address.city,
                    state: userDto.address.state,
                    cep: userDto.address.cep,
                    complement: userDto.address.complement,
                }
            },
            Vehicle: {
                create: {
                    created_at: userDto.vehicle.created_at,
                    updated_at: userDto.vehicle.updated_at, 
                    model: userDto.vehicle.model,
                    color: userDto.vehicle.color,
                    mark: userDto.vehicle.mark,
                    plate: userDto.vehicle.plate,
                    path_to_document: userDto.vehicle.path_to_document
                }
            },
            role: userDto.role,
        };
    }

    private async findUserByIdentifierOrEmail(identifier: string, email: string){
        const userReturn =  await this.repository.findUserByIdentifierOrEmail(identifier, email);
        if(userReturn !== null){
            throw new CustomException("User already exists", 409);
        }
    }

    private async deleteImage(file: Express.Multer.File){
        const filePath = path.resolve(file.path);
        fs.unlink(filePath, (err) => {
            if (err) {throw new CustomException(err.name + " " + err.code,);}
        });
    }
          
}