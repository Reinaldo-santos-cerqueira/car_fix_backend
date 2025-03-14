import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { ServiceProviderOnlinerepository } from "@repositories";
import { ServiceProviderSignupSocketIoRequest } from "@utils";

export function setupSocket(server: HttpServer) {
    const serviceProviderOnlinerepository = new ServiceProviderOnlinerepository();
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket: Socket) => {
        const sendError = (message: string) => {
            io.to(socket.id).emit("error_message", {message});
        };

        socket.on("signup_provider_service", async (msg) => {
            if (!msg || typeof msg !== "string") {
                sendError("Id is required and must be a string");
                return;
            }

            try {
                const existingUser = await serviceProviderOnlinerepository.findById(msg);

                const serviceProviderOnline: ServiceProviderSignupSocketIoRequest = {
                    socketIoId: socket.id,
                    serviceProviderId: msg,
                    state: 0
                };

                if (!existingUser) {
                    await serviceProviderOnlinerepository.save(
                        serviceProviderOnline.socketIoId,
                        serviceProviderOnline.serviceProviderId,
                        serviceProviderOnline.state
                    );
                    io.to(socket.id).emit("signup_provider_service", "Cadastrado");
                } else {
                    await serviceProviderOnlinerepository.update(
                        serviceProviderOnline.socketIoId,
                        serviceProviderOnline.serviceProviderId,
                        serviceProviderOnline.state
                    );
                    io.to(socket.id).emit("signup_provider_service", "Atualizado");
                }
            } catch (error) {
                sendError("Erro ao processar cadastro: " + error);
            }
        });

        socket.on("request_service", (msg) => {
            if (!msg) {
                sendError("Data of service is required");
                return;
            }

            io.emit("received_service", msg);
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado:", socket.id);
        });
    });

    return io;
}
