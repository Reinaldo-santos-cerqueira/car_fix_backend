import { ServiceController } from "@controllers";
import express from "express";
const serviceRouter = express.Router();
const controller = new ServiceController();

serviceRouter.get("service", async (req, res) => {
    return await controller.get(req, res);
});

export {
    serviceRouter
};