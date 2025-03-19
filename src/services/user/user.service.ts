import { ChangePasswordDto, LoginDto, SendTokenDto, ServiceProviderDto, UserDto } from "@dto";
import { CustomException } from "@exceptions";
import { Prisma } from "@prisma/client";
import { UserRepository,ServiceProviderServiceRepository } from "@repositories";
import bcrypt from "bcrypt";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
import { removeImage } from "@utils";

dotenv.config();

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
            
        } catch (error) {
            if(error instanceof CustomException ){
                removeImage(file);
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
            await this.findUserByIdentifierOrEmailOrCnh(serviceProviderDto.user_dto.identifier, serviceProviderDto.user_dto.email, serviceProviderDto.cnh);
            serviceProviderDto.user_dto.vehicle.path_to_document = fileImageDocumentVehicle.path;
            serviceProviderDto.path_to_image_cnh = fileImageCnh.path;
            const serviceProvider: Prisma.UserCreateInput = await this.createServiceUserCreateInput(serviceProviderDto);     
            await this.repository.saveServiceProvider(serviceProvider);
        } catch (error) {
            if(error instanceof CustomException ){
                removeImage(fileImageCnh);
                removeImage(fileImageDocumentVehicle);
                throw new CustomException(error.message, error.statusCode);
            }
            throw new CustomException(error + "", 500);
        }
    }

    private async createServiceUserCreateInput(serviceProviderDto: ServiceProviderDto): Promise<Prisma.UserCreateInput> {
        return {
            full_name: serviceProviderDto.user_dto.full_name,
            phone_number: serviceProviderDto.user_dto.phone_number,
            email: serviceProviderDto.user_dto.email,
            identifier: serviceProviderDto.user_dto.identifier,
            password: await this.encryptPassword(serviceProviderDto.user_dto.password),
            created_at: serviceProviderDto.user_dto.created_at,
            updated_at: serviceProviderDto.user_dto.updated_at,
            token_phone: serviceProviderDto.user_dto.token_phone,
            token_password_change: serviceProviderDto.user_dto.token_password_change,
            type: serviceProviderDto.user_dto.type,
            address: {
                create: {
                    created_at: serviceProviderDto.user_dto.address.created_at,
                    updated_at: serviceProviderDto.user_dto.address.updated_at,
                    neighborhood: serviceProviderDto.user_dto.address.neighborhood,
                    street: serviceProviderDto.user_dto.address.street,
                    number: serviceProviderDto.user_dto.address.number,
                    city: serviceProviderDto.user_dto.address.city,
                    state: serviceProviderDto.user_dto.address.state,
                    cep: serviceProviderDto.user_dto.address.cep,
                    complement: serviceProviderDto.user_dto.address.complement,
                }
            },
            Vehicle: {
                create: {
                    created_at: serviceProviderDto.user_dto.vehicle.created_at,
                    updated_at: serviceProviderDto.user_dto.vehicle.updated_at, 
                    model: serviceProviderDto.user_dto.vehicle.model,
                    color: serviceProviderDto.user_dto.vehicle.color,
                    mark: serviceProviderDto.user_dto.vehicle.mark,
                    plate: serviceProviderDto.user_dto.vehicle.plate,
                    path_to_document: serviceProviderDto.user_dto.vehicle.path_to_document
                }
            },
            ServiceProvider: {
                create: {
                    cnh: serviceProviderDto.cnh,
                    created_at: serviceProviderDto.user_dto.created_at,
                    updated_at: serviceProviderDto.user_dto.updated_at,
                    path_to_image_cnh: serviceProviderDto.path_to_image_cnh,
                    ServiceProviderService:{
                        create: serviceProviderDto.services_id.map(serviceId => ({
                            serviceId
                        }))
                    }
                }
            },
            role: serviceProviderDto.user_dto.role,
        };
    }

    private async findUserByIdentifierOrEmailOrCnh(identifier: string, email: string, cnh: string){
        
        const userReturn =  await this.repository.findUserByIdentifierOrEmailorCnh(identifier, email,cnh);
        if(userReturn !== null){
            throw new CustomException("User already exists", 409);
        }
    }

    async loginClient(loginDto: LoginDto) {
        const user = await this.repository.findByEmail(loginDto.email);
        if (!user || !(await this.comparePassword(loginDto.password, user.password))) {
            throw new CustomException("Email or password incorrect", 401);
        }
    }

    async loginServiceProvider(loginDto: LoginDto): Promise<string[]> {
        const user = await this.repository.findByEmailAndSelectService(loginDto.email);
        if (!user || !(await this.comparePassword(loginDto.password, user.password))) {
            throw new CustomException("Email or password incorrect", 401);
        }
        const serviceIds = user?.ServiceProvider.flatMap(sp =>
            sp.ServiceProviderService.map(sps => sps.serviceId)
        ) || [];
        return serviceIds;
    }

    async sendByTokenTradePassword(sendTokenDto: SendTokenDto) {
        const user = await this.repository.findByEmail(sendTokenDto.email);
        if (!user) {
            throw new CustomException("Email is incorrect", 401);
        }
        const randomToken = this.generateCodeRandomTokenPhone();
        await this.repository.updateTokenByEmail(sendTokenDto.email, randomToken);
        await this.sendEmail(user.email, "Redefinição de Senha", this.createMessageEmail("car fix enterprise", user.full_name, randomToken));
    }

    async changePassword(changePasswordDto:ChangePasswordDto) {
        await this.repository.updatePasswordFindByEmailAndToken(changePasswordDto.email,changePasswordDto.token, await this.encryptPassword(changePasswordDto.password));
    }

    private async encryptPassword(password: string):Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private async comparePassword(passwordRequest: string, passwordDb: string): Promise<boolean> {
        return await bcrypt.compare(passwordRequest, passwordDb);
    }

    private generateCodeRandomTokenPhone() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            const randomCharacters = Math.floor(Math.random() * characters.length);
            code += characters[randomCharacters];
        }
        return code;
    }

    private async sendEmail(recipient: string, subject:string, message: string) {
        const transporter = createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: recipient,
            subject: subject,
            html: message
        };

        await transporter.sendMail(mailOptions);
    }
    private createMessageEmail(enterprise: string,userName: string, randomToken: string): string {
        return `
            <p>Olá, ${userName},</p>
            <p>Recebemos uma solicitação para redefinir sua senha. Para continuar com o processo, utilize o código abaixo:</p>
            <h2 style="color: #2d89ef;">🔑 ${randomToken}</h2>
            <p>Se você não solicitou a alteração, ignore este e-mail. O código expirará em 30 minutos.</p>
            <p>Atenciosamente,</p>
            <p><strong>${enterprise}</strong></p>
        `;
    }
}