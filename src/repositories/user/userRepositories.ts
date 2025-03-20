import { PrismaClient, Prisma } from "@prisma/client";

export class UserRepositories{
    prisma = new PrismaClient();

    async save(user: Prisma.UserCreateInput): Promise<Prisma.UserCreateInput> {
        return this.prisma.user.create({
            data: user
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
}