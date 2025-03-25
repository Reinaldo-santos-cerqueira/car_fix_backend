import { UserService } from "@services";
import { Request, Response } from "express";

export class UserController {
    service: UserService;
    constructor(){
        this.service = new UserService();
    }

    async saveClient(req: Request, res: Response): Promise<void> {
        await this.service.saveClient(req.body,req.file);
        res.status(201).json({});
    }

    async saveServiceProvider(req: Request, res: Response):Promise<void>{
        await this.service.saveServiceProvider(req.body,req.files);
        res.status(201).json({});
    }

    async loginClient(req: Request, res: Response): Promise<void>{
        await this.service.loginClient(req.body);
        res.status(200).json({});
    }

    async logiServiceProvider(req: Request, res: Response): Promise<void> {
        const serviceId = await this.service.loginServiceProvider(req.body);
        res.status(200).json(serviceId);
    }

    async sendByTokenTradePassword(req: Request, res: Response): Promise<void> {
        const serviceId = await this.service.sendByTokenTradePassword(req.body);
        res.status(200).json(serviceId);
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        await this.service.changePassword(req.body);
        res.status(204).json();
    }

}