import express,{ Router } from "express";
import { userRouter } from "./user.routes";
import { serviceRouter } from "./service.routes";
import { vehicleRouter } from "./vehicle.routes";
import path from "path";

export const routes = Router();

routes.use(userRouter);
routes.use(serviceRouter);
routes.use(vehicleRouter);
const imagesDir = path.join(__dirname, "../../uploads");

routes.use("/uploads", express.static(imagesDir));