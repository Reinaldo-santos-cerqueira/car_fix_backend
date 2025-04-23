import { ServiceService } from "@services";
import { Request, Response } from "express";

export class ServiceController {
    service: ServiceService;
    constructor() {
        this.service = new ServiceService();
    }
    async get(req: Request, res: Response): Promise<void> {
        res.status(200).json(await this.service.get());
    }
}