import {  ServiceRequested } from "@prisma/client";
import {prisma} from "./log.repositories";

export class ServiceRequestedRepository {
    async createServiceRequested(data: ServiceRequested): Promise<ServiceRequested> {
        return await prisma.serviceRequested.create({
            data
        });
    }

    async updateServiceRequested(id: string, serviceProviderID: string,status: number): Promise<ServiceRequested> {
        return await prisma.serviceRequested.update({
            where: {
                id
            },
            data: {
                service_provider_id: serviceProviderID,
                status
            }
        });
    }
}