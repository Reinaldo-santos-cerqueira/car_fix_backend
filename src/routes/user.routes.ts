import express, { Request, Response } from "express";
import { ValidationDtoMiddlewares,uploadImage } from "@middlewares";
import { UserController } from "@controllers";


const userRouter = express.Router();
const controller = new UserController();

userRouter.post("/users",uploadImage.single("imageDocumentVehicle"),ValidationDtoMiddlewares.validateUser(), async (req: Request, res: Response) => {    
    return await controller.save(req,res);
});

export { userRouter };
