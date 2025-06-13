import { ServiceProviderOnline, ServiceRequested } from "@prisma/client";
import { ServiceProviderOnlinerepository, ServiceRepository, ServiceRequestedRepository, UserRepository } from "@repositories";
import { AcceptedServiceToClient, AcceptedServiceToServiceProvider, AceptService, CanceledService, ChangeSocketId, ConfirmedStartService, ServiceProviderSignupSocketIoRequest } from "@utils";
export class SocketService {
    private readonly serviceProviderRepo: ServiceProviderOnlinerepository;
    private readonly serviceRequestedRepo: ServiceRequestedRepository;
    private readonly userRepository: UserRepository;
    private readonly serviceRepository: ServiceRepository;
    constructor() {
        this.serviceProviderRepo = new ServiceProviderOnlinerepository();
        this.serviceRequestedRepo = new ServiceRequestedRepository();
        this.userRepository = new UserRepository();
        this.serviceRepository = new ServiceRepository();
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

    public async sendRequestedService(msg: ServiceRequested): Promise<{ idServiceRequested: string, serviceProviderOnline: ServiceProviderOnline[] }> {
        let serviceRequestedCreated;
        if (msg.id === undefined) {
            serviceRequestedCreated = await this.serviceRequestedRepo.createServiceRequested(msg);
        } else {
            serviceRequestedCreated = await this.serviceRequestedRepo.get(msg);
        }
        const serviceProviderOnline: ServiceProviderOnline[] = await this.serviceProviderRepo.findByState(msg.service_id);
        return { idServiceRequested: serviceRequestedCreated!.id, serviceProviderOnline };
    }

    public async aceptServiceByServiceProvider(msg: AceptService): Promise<AcceptedServiceToServiceProvider | null> {
        const returnRequestById = await this.serviceRequestedRepo.findById(msg.serviceRequestedId);
        if (returnRequestById?.status !== 0) {
            return null;
        }
        const requestedServiceDb = await this.serviceRequestedRepo.updateServiceRequestedProviderService(msg);
        const serviceProvider = await this.userRepository.findServiceProviderById(msg.serviceProviderId);
        const service = await this.serviceRepository.getById(requestedServiceDb.service_id);
        const paramsRequestServiceProvider = msg.longitudeServiceProvider + "," + msg.latitudeServiceProvider;
        const paramsRequestClient = requestedServiceDb.longitude_client + "," + requestedServiceDb.latitude_client;
        const paramsRequest = paramsRequestServiceProvider + ";" + paramsRequestClient;
        const urlRequest = `http://router.project-osrm.org/route/v1/driving/${paramsRequest}?overview=false`;
        let distance = 0;
        let duration = 0;
        const response = await fetch(urlRequest);
        const data = await response.json();
        const route = data.routes[0];
        for (const leg of route.legs) {
            distance = distance + leg.distance;
            duration = duration + leg.duration;
        };
        const valueService = service!.price_service + ((distance / 1000) * service!.price_km_traveled);
        return { distance: Math.ceil(distance / 1000), duration: Math.ceil(duration / 60), requestedService: requestedServiceDb, serviceProvider: serviceProvider, valueService: valueService };
    }

    public async aceptServiceByClient(msg: ConfirmedStartService): Promise<AcceptedServiceToClient | void> {
        const returnRequestById = await this.serviceRequestedRepo.findById(msg.serviceRequestedId);
        if (returnRequestById?.status !== 1) {
            return;
        }
        const dataUser = await this.userRepository.findClientById(returnRequestById.user_id_client!);
        return { serviceRequested: await this.serviceRequestedRepo.updateServiceRequestedClient(msg), client: { vehicle: dataUser!.Vehicle, path_profile_image: dataUser!.path_profile_image } };
    }

    public async canceledService(msg: CanceledService): Promise<{ socketIoIdClient: string, socketIoIdServiceProvider: string } | null> {
        const returnDb = await this.serviceRequestedRepo.canceledServiceRequested(msg);
        if (returnDb) {
            if (returnDb.service_provider_socket_io_id && returnDb.user_id_socket_io_id) {
                return { socketIoIdClient: returnDb.user_id_socket_io_id, socketIoIdServiceProvider: returnDb.service_provider_socket_io_id };

            }
        }
        return null;
    }

    public async handlechangeSocketId(msg: ChangeSocketId, socketId: string) {
        if (msg.type === "client") {
            await this.serviceRequestedRepo.changeSocketIdClient(msg, socketId);
        } else {
            await this.serviceRequestedRepo.changeSocketIdServiceProvider(msg, socketId);
        }

    }
}