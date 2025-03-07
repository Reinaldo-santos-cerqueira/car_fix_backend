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
}