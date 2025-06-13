import { ServiceProviderOnline } from "@prisma/client";
import { prisma } from "./log.repository";

export class ServiceProviderOnlinerepository {

    async save(socketIoId: string, serviceProviderId: string, state: number): Promise<void> {
        await prisma.serviceProviderOnline.create({
            data: {
                socket_io_id: socketIoId,
                user_id: serviceProviderId,
                state: state
            }
        });
    }

    async update(socketIoId: string, serviceProviderId: string, state: number) {
        await prisma.serviceProviderOnline.update({
            data: {
                state: state,
                socket_io_id: socketIoId,
            },
            where: {
                user_id: serviceProviderId,
            }
        });
    }

    async findById(serviceProviderId: string): Promise<ServiceProviderOnline | null> {
        return prisma.serviceProviderOnline.findFirst({
            where: {
                user_id: serviceProviderId
            }
        });
    }

    async findByState(serviceId: string): Promise<ServiceProviderOnline[]> {
        return prisma.serviceProviderOnline.findMany({
            where: {
                state: 0,
                user:{
                    ServiceProvider:{
                        some:{
                            ServiceProviderService:{
                                some:{
                                    serviceId: serviceId
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async deleteBySocketId(socketIoId: string): Promise<void> {
        await prisma.serviceProviderOnline.deleteMany({
            where: {
                socket_io_id: socketIoId,
            }
        });
    }

}
