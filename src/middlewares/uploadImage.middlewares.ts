import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "path";


const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, "uploads/");
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const uploadImage = multer({ storage: storage });