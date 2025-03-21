import { ServiceProviderOnline, ServiceRequested } from "@prisma/client";
import { ServiceProviderOnlinerepository, ServiceRequestedRepository } from "@repositories";
import { AcceptedServiceToServiceProvider, AceptService, CanceledService, ConfirmedStartService, LegData, ServiceProviderSignupSocketIoRequest } from "@utils";

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

    public async aceptServiceByServiceProvider(msg: AceptService): Promise<AcceptedServiceToServiceProvider | null> {
        const returnRequestById =  await this.serviceRequestedRepo.findById(msg.serviceRequestedId);
        if (returnRequestById?.status !==0) {
            return null;
        }
        const requestedServiceDb = await this.serviceRequestedRepo.updateServiceRequestedProviderService(msg);
        const paramsRequestServiceProvider = msg.latitudeServiceProvider + "," + msg.longitudeServiceProvider;
        const paramsRequestClient = requestedServiceDb.latitude_client + "," + requestedServiceDb.longitude_client;
        const paramsRequest = paramsRequestServiceProvider + ";" + paramsRequestClient;
        const urlRequest = `http://router.project-osrm.org/route/v1/driving/${paramsRequest}?overview=false`;
        let distance = 0;
        let duration = 0;
        const response = await fetch(urlRequest);
        const data = await response.json();
        if (data.code === "Ok") {
            const route = data.routes[0];    
            route.legs.forEach((leg: LegData) => {
                distance = distance + leg.distance;
                duration = duration + leg.duration;
            });
        }
        return {distance, duration: duration/60, requestedService: requestedServiceDb};
    }

    public async aceptServiceByClient(msg: ConfirmedStartService): Promise<ServiceRequested | void> {
        const returnRequestById = await this.serviceRequestedRepo.findById(msg.serviceRequestedId);
        if (returnRequestById?.status !== 1) {
            return;
        }
        return await this.serviceRequestedRepo.updateServiceRequestedClient(msg);
    }

    public async canceledService(msg: CanceledService): Promise<{socketIoIdClient: string, socketIoIdServiceProvider: string} | null> {
        const returnDb = await this.serviceRequestedRepo.canceledServiceRequested(msg);
        if (returnDb) {
            if (returnDb.service_provider_socket_io_id && returnDb.user_id_socket_io_id) {
                return { socketIoIdClient: returnDb.user_id_socket_io_id, socketIoIdServiceProvider: returnDb.service_provider_socket_io_id };
                
            }
        }
        return null;
    }
}