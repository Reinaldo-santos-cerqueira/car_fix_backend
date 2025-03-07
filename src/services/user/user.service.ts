import { ServiceProviderDto, UserDto } from "@dto";
import { CustomException } from "@exceptions";
import { Prisma } from "@prisma/client";
import { UserRepository,ServiceProviderServiceRepository } from "@repositories";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export class UserService {
    repository: UserRepository;
    serviceProviderServiceRepository: ServiceProviderServiceRepository;
    constructor(){
        this.repository = new UserRepository();
        this.serviceProviderServiceRepository = new ServiceProviderServiceRepository();
    }

    async saveClient(userDto: UserDto, file: Express.Multer.File | undefined): Promise<void> { 
        if(!file){
            throw new CustomException("Image is required", 400);
        }
        try {
            await this.findUserByIdentifierOrEmail(userDto.identifier, userDto.email);
            userDto.vehicle.path_to_document = file.path;
            const user: Prisma.UserCreateInput = await this.createClientUserCreateInput(userDto);    
                
            await this.repository.saveClient(user);   
            return;
        } catch (error) {
            if(error instanceof CustomException ){
                this.deleteImage(file);
                throw new CustomException(error.message, error.statusCode);
            }
            throw new CustomException(error + "", 500);
        }
    }

    private async createClientUserCreateInput(userDto: UserDto): Promise<Prisma.UserCreateInput> {
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

    async saveServiceProvider(serviceProviderDto: ServiceProviderDto, files: Express.Multer.File[] | {
        [fieldname: string]: Express.Multer.File[];
    } | undefined): Promise<void> { 
        let fileImageDocumentVehicle: Express.Multer.File | undefined = undefined;
        let fileImageCnh: Express.Multer.File | undefined = undefined;
        if(!files){
            throw new CustomException("Images is required", 400);
        }
        const fileArray: Express.Multer.File[] = Array.isArray(files) 
            ? files 
            : Object.values(files).flat();

        for (const file of fileArray) {
            if (file.fieldname === "imageDocumentVehicle") {
                fileImageDocumentVehicle = file;
            }else if(file.fieldname === "imageCnh"){
                fileImageCnh = file;
            }
        }

        if(!fileImageDocumentVehicle){
            throw new CustomException("Image document vehicle is required", 400);
        }
        if(!fileImageCnh){
            throw new CustomException("Image cnh is required", 400);
        }
        try {
            await this.findUserByIdentifierOrEmailOrCnh(serviceProviderDto.identifier, serviceProviderDto.email, serviceProviderDto.cnh);
            serviceProviderDto.vehicle.path_to_document = fileImageDocumentVehicle.path;
            serviceProviderDto.path_to_image_cnh = fileImageCnh.path;
            const serviceProvider: Prisma.UserCreateInput = await this.createServiceUserCreateInput(serviceProviderDto);    
            
            const saveServiceProvider = await this.repository.saveServiceProvider(serviceProvider);   
            await this.serviceProviderServiceRepository.save(saveServiceProvider.ServiceProvider[0].id, serviceProviderDto.services_id);
            return;
        } catch (error) {
            if(error instanceof CustomException ){
                this.deleteImage(fileImageCnh);
                this.deleteImage(fileImageDocumentVehicle);
                throw new CustomException(error.message, error.statusCode);
            }
            throw new CustomException(error + "", 500);
        }
    }

    private async createServiceUserCreateInput(serviceProviderDto: ServiceProviderDto): Promise<Prisma.UserCreateInput> {
        return {
            full_name: serviceProviderDto.full_name,
            phone_number: serviceProviderDto.phone_number,
            email: serviceProviderDto.email,
            identifier: serviceProviderDto.identifier,
            password: await this.encryptPassword(serviceProviderDto.password),
            created_at: serviceProviderDto.created_at,
            updated_at: serviceProviderDto.updated_at,
            token_phone: serviceProviderDto.token_phone,
            token_password_change: serviceProviderDto.token_password_change,
            type: serviceProviderDto.type,
            address: {
                create: {
                    created_at: serviceProviderDto.address.created_at,
                    updated_at: serviceProviderDto.address.updated_at,
                    neighborhood: serviceProviderDto.address.neighborhood,
                    street: serviceProviderDto.address.street,
                    number: serviceProviderDto.address.number,
                    city: serviceProviderDto.address.city,
                    state: serviceProviderDto.address.state,
                    cep: serviceProviderDto.address.cep,
                    complement: serviceProviderDto.address.complement,
                }
            },
            Vehicle: {
                create: {
                    created_at: serviceProviderDto.vehicle.created_at,
                    updated_at: serviceProviderDto.vehicle.updated_at, 
                    model: serviceProviderDto.vehicle.model,
                    color: serviceProviderDto.vehicle.color,
                    mark: serviceProviderDto.vehicle.mark,
                    plate: serviceProviderDto.vehicle.plate,
                    path_to_document: serviceProviderDto.vehicle.path_to_document
                }
            },
            ServiceProvider: {
                create: {
                    cnh: serviceProviderDto.cnh,
                    created_at: serviceProviderDto.created_at,
                    updated_at: serviceProviderDto.updated_at,
                    path_to_image_cnh: serviceProviderDto.path_to_image_cnh,
                }
            },
            role: serviceProviderDto.role,
        };
    }

    private async findUserByIdentifierOrEmailOrCnh(identifier: string, email: string, cnh: string){
        const userReturn =  await this.repository.findUserByIdentifierOrEmailorCnh(identifier, email,cnh);
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

    private async encryptPassword(password: string):Promise<string> {
        return await bcrypt.hash(password, 10);
    }

}