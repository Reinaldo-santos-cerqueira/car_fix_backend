import {  ServiceRequested } from "@prisma/client";
import {prisma} from "./log.repositories";
import { AceptService } from "@utils";

export class ServiceRequestedRepository {
    async createServiceRequested(data: ServiceRequested): Promise<ServiceRequested> {
        return await prisma.serviceRequested.create({
            data
        });
    }

    async updateServiceRequested(data:AceptService): Promise<ServiceRequested> {
        return await prisma.serviceRequested.update({
            where: {
                id: data.serviceRequestedId
            },
            data: {
                service_provider_id: data.serviceProviderId,
                service_provider_socket_io_id: data.serviceProviderSocketId,
                status: data.status,
                latitude_service_provider: data.latitudeServiceProvider,
                longitude_service_provider: data.longitudeServiceProvider
            }
        });
    }
}