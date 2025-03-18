import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { SocketController } from "@controllers";
import { ServiceRequested } from "@prisma/client";

export function setupSocket(server: HttpServer): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    const socketController = new SocketController(io);

    io.on("connection", (socket: Socket) => {

        socket.on("signup_provider_service", (msg) =>
            socketController.handleSignupProviderService(socket, msg)
        );

        socket.on("request_service", (msg: ServiceRequested) =>
            socketController.handleRequestService(socket, msg)
        );

        socket.on("disconnect", () =>
            socketController.handleDisconnect(socket)
        );
    });

    return io;
}
