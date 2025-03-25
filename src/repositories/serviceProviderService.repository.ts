import { ServiceProviderService } from "@prisma/client";
import {prisma} from "./log.repository";

export class ServiceProviderServiceRepository{

    async save(idServiceProvider: string, service_ids: string[]): Promise<ServiceProviderService[]> {
        const serviceProviderServiceArray = [];
        for(const service in service_ids){
            const serviceProviderService = await prisma.serviceProviderService.create({
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
