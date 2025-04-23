import { Service } from "@prisma/client";
import { ServiceRepository } from "@repositories";

export class ServiceService {
    repository: ServiceRepository;
    constructor() {
        this.repository = new ServiceRepository();
    }
    async get(): Promise<Service[] | null> {
        return await this.repository.get();
    }
}