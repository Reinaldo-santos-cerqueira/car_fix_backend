import { ServiceRequested } from "@prisma/client";
import { prisma } from "./log.repository";
import { AceptService, CanceledService, ConfirmedStartService } from "@utils";

export class ServiceRequestedRepository {
    async createServiceRequested(data: ServiceRequested): Promise<ServiceRequested> {
        return await prisma.serviceRequested.create({
            data
        });
    }

    async updateServiceRequestedProviderService(data: AceptService): Promise<ServiceRequested> {
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

    async updateServiceRequestedClient(data: ConfirmedStartService): Promise<ServiceRequested> {
        return await prisma.serviceRequested.update({
            where: {
                id: data.serviceRequestedId
            },
            data: {
                status: data.status
            }
        });
    }

    async findById(id: string): Promise<ServiceRequested | null> {
        return await prisma.serviceRequested.findUnique({
            where: {
                id
            }
        });
    }

    public async canceledServiceRequested(data: CanceledService): Promise<ServiceRequested | null> {
        return await prisma.serviceRequested.update({
            where: {
                id: data.serviceRequestedId
            },
            data: {
                status: 5
            }
        });
    }
}