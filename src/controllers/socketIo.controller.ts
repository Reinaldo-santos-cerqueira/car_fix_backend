import { Server, Socket } from "socket.io";
import { SocketService } from "@services";
import { ServiceProviderOnline, ServiceRequested } from "@prisma/client";

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

    public async handleSignupProviderService(socket: Socket, msg: string) {
        try {
            const response = await this.socketService.signupProviderService(socket.id, msg);
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
        const arrayServiceProviderOnline:ServiceProviderOnline[] = await this.socketService.sendRequestedService(msg);
        arrayServiceProviderOnline.forEach( (item) => {
            this.io.to(item.service_provider_id).emit("received_service", msg);
        });
    }

    public async handleDisconnect(socket: Socket) {
        await this.socketService.removeProviderBySocketId(socket.id);
    }

}
