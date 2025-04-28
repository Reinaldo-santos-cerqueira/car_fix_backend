import { Router } from "express";
import { userRouter } from "./user.routes";
import { serviceRouter } from "./service.routes";
import { vehicleRouter } from "./vehicle.routes";

export const routes = Router();

routes.use(userRouter);
routes.use(serviceRouter);
routes.use(vehicleRouter);