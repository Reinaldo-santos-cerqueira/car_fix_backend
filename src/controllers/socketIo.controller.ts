import { Server, Socket } from "socket.io";
import { SocketService } from "@services";
import { ServiceProviderOnline, ServiceRequested } from "@prisma/client";
import { aceptService } from "@utils";

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
        msg.user_socket_io_id = socket.id;
        const arrayServiceProviderOnline:ServiceProviderOnline[] = await this.socketService.sendRequestedService(msg);       
        arrayServiceProviderOnline.forEach( (item) => {
            this.io.to(item.socket_io_id).emit("received_service", msg);
        });
    }

    public async handleAcceptServiceToServiceProvider(socket: Socket, msg: aceptService){
        if (!msg) {
            this.sendError(socket, "Os dados do serviço são obrigatórios.");
            return null;
        }
        msg.serviceProviderSocketId = socket.id;
        
        const returnAccept = await this.socketService.aceptServiceByServiceProvider(msg);
        if(returnAccept){
            if(returnAccept.requestedService.user_socket_io_id){
                this.io.to(returnAccept.requestedService.user_socket_io_id).emit("accepted_service", returnAccept);
            }
        }

    }

    public async handleDisconnect(socket: Socket) {
        await this.socketService.removeProviderBySocketId(socket.id);
    }

}
