/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { SocketController } from "@controllers";

export function setupSocket(server: HttpServer): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
        },
    });

    const socketController = new SocketController(io);

    io.on("connection", (socket: Socket) => {
        socket.on("signup_provider_service", (msg) =>
            socketController.handleSignupProviderService(socket, msg as any)
        );

        socket.on("request_service", (msg: string) =>
            socketController.handleRequestService(socket, msg as any)
        );

        socket.on("accept_service_service_provider", async (msg: string) =>
            await socketController.handleAcceptServiceToServiceProvider(socket, msg as any)
        );

        socket.on("accept_service_client", async (msg: string) =>
            await socketController.handleAcceptServiceToClient(socket, msg as any)
        );
        socket.on("cancel_service", async (msg: string) =>
            await socketController.handleCanceledService(socket, msg as any)
        );

        socket.on("change_socket_id", async (msg: string) =>
            await socketController.handlechangeSocketId(socket, msg as any)
        );

        socket.on("disconnect", () =>
            socketController.handleDisconnect(socket)
        );
    });

    return io;
}
