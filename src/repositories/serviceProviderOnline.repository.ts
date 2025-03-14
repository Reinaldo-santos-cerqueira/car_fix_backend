import { PrismaClient, ServiceProviderOnline} from "@prisma/client";

export class ServiceProviderOnlinerepository{
    prisma = new PrismaClient();

    async save(socketIoId: string, serviceProviderId: string,state: number ): Promise<void> {
        await this.prisma.serviceProviderOnline.create({
            data: {
                socket_io_id: socketIoId,
                service_provider_id: serviceProviderId,
                state: state
            }
        });
    }

    async update(socketIoId: string, serviceProviderId: string,state: number){
        await this.prisma.serviceProviderOnline.update({
            data:{
                state: state,
                socket_io_id: socketIoId,
            },
            where:{
                service_provider_id: serviceProviderId,
            }
        });
    }

    async findById(serviceProviderId: string):Promise<ServiceProviderOnline | null>{
        return this.prisma.serviceProviderOnline.findFirst({
            where: {
                service_provider_id: serviceProviderId
            }
        });
    }

}