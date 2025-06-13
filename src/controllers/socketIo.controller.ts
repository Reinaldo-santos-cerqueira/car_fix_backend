import { Server, Socket } from "socket.io";
import { SocketService } from "@services";
import { ServiceProviderOnline, ServiceRequested } from "@prisma/client";
import { AceptService, CanceledService, ChangeSocketId, ConfirmedStartService, SignUpServiceProviderOnline } from "@utils";

export class SocketController {
    private readonly io: Server;
    private readonly socketService: SocketService;

    constructor(io: Server) {
        this.io = io;
        this.socketService = new SocketService();
    }

    private sendError(socket: Socket, message: string) {
        this.io.to(socket.id).emit("error_message", { message });
    }

    public async handleSignupProviderService(socket: Socket, msg: SignUpServiceProviderOnline) {
        try {
            const response = await this.socketService.signupProviderService(socket.id, msg.service_provider_user_id);
            this.io.to(socket.id).emit("signup_provider_service", response);
        } catch (error) {
            this.sendError(socket, error + "");
        }
    }

    public async handleRequestService(socket: Socket, msg: ServiceRequested) {
        if (!msg) {
            this.sendError(socket, "Os dados do serviço são obrigatórios.");
            return;
        }
        msg.user_id_socket_io_id = socket.id;
        const arrayReturn: { idServiceRequested: string, serviceProviderOnline: ServiceProviderOnline[] } = await this.socketService.sendRequestedService(msg);
        msg.id = arrayReturn.idServiceRequested;
        this.io.to(socket.id).emit("received_service", msg);
        arrayReturn.serviceProviderOnline.forEach((item) => {
            this.io.to(item.socket_io_id).emit("received_service", msg);
        });
    }

    public async handleAcceptServiceToServiceProvider(socket: Socket, msg: AceptService): Promise<void> {
        if (!msg) {
            this.sendError(socket, "Os dados do serviço são obrigatórios.");
            return;
        }

        msg.serviceProviderSocketId = socket.id;

        const returnAccept = await this.socketService.aceptServiceByServiceProvider(msg);

        if (returnAccept) {
            if (returnAccept.requestedService.user_id_socket_io_id) {
                this.io.to(returnAccept.requestedService.user_id_socket_io_id).emit("accepted_service", returnAccept);
            }
            return;
        }

        this.sendError(socket, "Serviço não mais disponivel.");
    }

    public async handleAcceptServiceToClient(socket: Socket, msg: ConfirmedStartService) {
        if (!msg) {
            this.sendError(socket, "Os dados do serviço são obrigatórios.");
            return;
        }

        const returnAccept = await this.socketService.aceptServiceByClient(msg);

        if (returnAccept) {
            if (returnAccept.serviceRequested.service_provider_socket_io_id) {
                this.io.to(returnAccept.serviceRequested.service_provider_socket_io_id).emit("confirmed_start_service", returnAccept);
            }
            if (returnAccept.serviceRequested.user_id_socket_io_id) {
                this.io.to(returnAccept.serviceRequested.user_id_socket_io_id).emit("confirmed_start_service", returnAccept);
            }
            return;
        }

        this.sendError(socket, "Serviço não pode ser aceito no momento continue esperando.");
    }

    public async handleCanceledService(socket: Socket, msg: CanceledService) {
        if (!msg) {
            this.sendError(socket, "Os dados do serviço são obrigatórios.");
            return;
        }

        const returnServiceRequested = await this.socketService.canceledService(msg);
        if (returnServiceRequested) {
            this.io.to(returnServiceRequested.socketIoIdClient).emit("canceled_service", msg);
            this.io.to(returnServiceRequested.socketIoIdServiceProvider).emit("canceled_service", msg);
        }
    }

    public async handlechangeSocketId(socket: Socket, msg: ChangeSocketId) {
        if (!msg) {
            this.sendError(socket, "Os dados do serviço são obrigatórios.");
            return;
        }
        await this.socketService.handlechangeSocketId(msg, socket.id);
    }

    public async handleDisconnect(socket: Socket) {
        await this.socketService.removeProviderBySocketId(socket.id);
    }
}
