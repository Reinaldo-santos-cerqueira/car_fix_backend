import { CustomException } from "@exceptions";
import { PrismaClient, Prisma, User } from "@prisma/client";

export class UserRepository{
    prisma = new PrismaClient();

    async saveClient(user: Prisma.UserCreateInput): Promise<Prisma.UserCreateInput> {
        return await this.prisma.user.create({
            data: user
        });
    }

    async saveServiceProvider(user: Prisma.UserCreateInput): Promise<{ ServiceProvider: { id: string; created_at: Date; updated_at: Date; path_to_image_cnh: string | null; cnh: string; user_id: string; }[]}> {
        return await this.prisma.user.create({
            data: user,
            select:{
                ServiceProvider: true
            }
        });
    }


    async findUserByIdentifierOrEmail(identifier: string, email: string): Promise<Prisma.UserCreateInput | null> {      
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    { identifier: identifier },
                    { email: email },
                ],
            },
        });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        });
    }

    async findByEmailAndSelectService(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                password: true,
                ServiceProvider: {
                    select: {
                        ServiceProviderService: {
                            select: {
                                serviceId: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async findUserByIdentifierOrEmailorCnh(identifier: string, email: string,cnh: string): Promise<User | null> {      
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    { identifier: identifier },
                    { email: email },
                    {ServiceProvider: {some: {cnh: cnh}},}
                ],
            },
            include:{
                ServiceProvider: true
            }
        });
    }
    
    async findByEmailAndToken(email: string, randomToken: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: {
                email: email,
                token_password_change: randomToken
            }
        });
    }

    async updatePasswordFindByEmailAndToken(email: string, randomToken: string, password: string): Promise<User | null>  {
        try {
            return await this.prisma.user.update({
                where: { email, token_password_change: randomToken },
                data: { password },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    throw new CustomException("Email or token incorrect", 401);
                }
            }
            throw new CustomException("Internal server error", 500);
        }
    }
}