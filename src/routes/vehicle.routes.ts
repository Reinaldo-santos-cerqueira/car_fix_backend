import { VehicleController } from "@controllers";
import { authMiddleware } from "@middlewares";
import express from "express";
const vehicleRouter = express.Router();
const controller = new VehicleController();

vehicleRouter.get("/vehicle", authMiddleware, async (req, res) => {
    return await controller.get(req, res);
});

export {
    vehicleRouter
};