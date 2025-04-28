import { Vehicle } from "@prisma/client";
import { prisma } from "./log.repository";

export class VehicleRepository {
    async get(user_id: string): Promise<Vehicle[] | null> {
        return await prisma.vehicle.findMany({
            where: {
                user_id
            }
        });
    }
}