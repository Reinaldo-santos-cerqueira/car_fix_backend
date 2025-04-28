import { VehicleService } from "@services";
import { Request, Response } from "express";

export class VehicleController {
    service: VehicleService;
    constructor() {
        this.service = new VehicleService();
    }
    async get(req: Request, res: Response): Promise<void> {
        res.status(200).json(await this.service.get(req.tokenData!.id));
    }
}