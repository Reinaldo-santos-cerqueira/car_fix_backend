import { PrismaClient, ServiceProviderService } from "@prisma/client";

export class ServiceProviderServiceRepository{
    prisma = new PrismaClient();

    async save(idServiceProvider: string, service_ids: string[]): Promise<ServiceProviderService[]> {
        const serviceProviderServiceArray = [];
        for(const service in service_ids){
            const serviceProviderService = await this.prisma.serviceProviderService.create({
                data: {
                    serviceId: service,
                    serviceProviderId: idServiceProvider
                }
            });
            serviceProviderServiceArray.push(serviceProviderService);
        }
        return serviceProviderServiceArray;
    }
}