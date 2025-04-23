import { Router } from "express";
import { userRouter } from "./user.routes";
import { serviceRouter } from "./service.routes";

export const routes = Router();

routes.use(userRouter);
routes.use(serviceRouter);