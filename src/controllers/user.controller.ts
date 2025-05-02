import { UserService } from "@services";
import { Request, Response } from "express";

export class UserController {
    service: UserService;
    constructor() {
        this.service = new UserService();
    }

    async saveClient(req: Request, res: Response): Promise<void> {
        await this.service.saveClient(req.body, req.files);
        res.status(201).json({});
    }

    async saveServiceProvider(req: Request, res: Response): Promise<void> {
        await this.service.saveServiceProvider(req.body, req.files);
        res.status(201).json({});
    }

    async loginClient(req: Request, res: Response): Promise<void> {
        res.status(200).json(await this.service.loginClient(req.body));
    }

    async logiServiceProvider(req: Request, res: Response): Promise<void> {
        res.status(200).json(await this.service.loginServiceProvider(req.body));
    }

    async sendByTokenTradePassword(req: Request, res: Response): Promise<void> {
        res.status(200).json(await this.service.sendByTokenTradePassword(req.body));
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        await this.service.changePassword(req.body);
        res.status(204).json();
    }

}