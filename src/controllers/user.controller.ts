import { UserService } from "@services";
import { Request, Response } from "express";

export class UserController {
    service: UserService;
    constructor(){
        this.service = new UserService();
    }

    async save(req: Request, res: Response): Promise<void> {
        const result = await this.service.save(req.body,req.file);
        res.status(201).json(result);
    }
}