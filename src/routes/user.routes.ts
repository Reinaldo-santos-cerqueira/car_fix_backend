import express, { Request, Response } from "express";
import {ValidationLoginDtoMiddlewares, ValidationServiceProviderDtoMiddlewares, ValidationUserDtoMiddlewares, uploadImage } from "@middlewares";
import { UserController } from "@controllers";

const userRouter = express.Router();
const controller = new UserController();

userRouter.post("/users/client", uploadImage.single("imageDocumentVehicle"), ValidationUserDtoMiddlewares.validateUser(), async (req: Request, res: Response) => {
    return await controller.saveClient(req, res);
});

userRouter.post("/users/service_provider",
    uploadImage.fields([
        { name: "imageDocumentVehicle", maxCount: 1 },
        { name: "imageCnh", maxCount: 1 }
    ]),
    ValidationServiceProviderDtoMiddlewares.validateUser(),
    async (req: Request, res: Response) => {
        return await controller.saveClient(req, res);
    }
);

userRouter.post("/users/login/client",ValidationLoginDtoMiddlewares.validateUser(), async (req: Request, res: Response) => {
    return await controller.loginClient(req, res);
});

userRouter.post("/users/login/service_provider",ValidationLoginDtoMiddlewares.validateUser(),async (req: Request, res: Response) => {
    return await controller.logiServiceProvider(req, res);
}
);

export { userRouter };
