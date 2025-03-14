/* eslint-disable no-console */
import "reflect-metadata";
import "module-alias/register";
import "express-async-errors";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Errors } from "@middlewares";
import { routes } from "@routes";
import { createServer } from "http";
import { setupSocket } from "./socketio/config";

dotenv.config();
const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

setupSocket(server);

app.get("/", (req: Request, res:Response) => {
    res.json({ message: "Rota padrão" });
});

app.use(routes);
  
app.use(Errors);

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
