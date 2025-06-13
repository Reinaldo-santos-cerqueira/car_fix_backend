import { Service } from "@prisma/client";
import { prisma } from "./log.repository";

export class ServiceRepository {
    async get(): Promise<Service[] | null> {
        return await prisma.service.findMany();
    }

    async getById(id: string): Promise<Service | null> {
        return await prisma.service.findUnique({
            where: {
                id,
            },
        });
    }
}