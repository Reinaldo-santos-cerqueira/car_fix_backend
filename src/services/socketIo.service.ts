import { ServiceProviderOnline, ServiceRequested } from "@prisma/client";
import { ServiceProviderOnlinerepository, ServiceRequestedRepository } from "@repositories";
import { ServiceProviderSignupSocketIoRequest } from "@utils";

export class SocketService {
    private readonly serviceProviderRepo: ServiceProviderOnlinerepository;
    private readonly serviceRequestedRepo: ServiceRequestedRepository;

    constructor() {
        this.serviceProviderRepo = new ServiceProviderOnlinerepository();
        this.serviceRequestedRepo = new ServiceRequestedRepository();
    }

    public async signupProviderService(socketId: string, providerId: string): Promise<string> {
        if (!providerId || typeof providerId !== "string") {
            throw new Error("O ID do provedor é obrigatório e deve ser uma string.");
        }

        const existingUser = await this.serviceProviderRepo.findById(providerId);

        const serviceProviderData: ServiceProviderSignupSocketIoRequest = {
            socketIoId: socketId,
            serviceProviderId: providerId,
            state: 0,
        };

        if (!existingUser) {
            await this.serviceProviderRepo.save(
                serviceProviderData.socketIoId,
                serviceProviderData.serviceProviderId,
                serviceProviderData.state
            );
            return "Cadastrado com sucesso!";
        } else {
            await this.serviceProviderRepo.update(
                serviceProviderData.socketIoId,
                serviceProviderData.serviceProviderId,
                serviceProviderData.state
            );
            return "Dados atualizados!";
        }
    }

    public async removeProviderBySocketId(socketId: string): Promise<void> {
        await this.serviceProviderRepo.deleteBySocketId(socketId);
    }

    public async sendRequestedService(msg: ServiceRequested): Promise<ServiceProviderOnline[]> {
        await this.serviceRequestedRepo.createServiceRequested(msg);
        const serviceProviderOnline:ServiceProviderOnline[]  = await this.serviceProviderRepo.findByState(); 
        return serviceProviderOnline;
    }
}
