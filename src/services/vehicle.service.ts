import { Vehicle } from "@prisma/client";
import { VehicleRepository } from "@repositories";

export class VehicleService {
    repository: VehicleRepository;

    constructor() {
        this.repository = new VehicleRepository();
    }
    async get(user_id: string): Promise<Vehicle[] | null> {
        return await this.repository.get(user_id);
    }
}