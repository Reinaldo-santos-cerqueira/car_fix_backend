import "reflect-metadata";
import "module-alias/register";
import "express-async-errors";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Errors } from "@middlewares";
import { routes } from "@routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res:Response) => {
    res.json({ message: "Rota padrão" });
});

app.use(routes);

app.use(Errors);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
