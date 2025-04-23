import { CustomException } from "@exceptions";
import fs from "fs";
import path from "path";

export const removeImage = async (file: Express.Multer.File) => {
    const filePath = path.resolve(file.path);
    fs.unlink(filePath, (err) => {
        if (err) { throw new CustomException(err.name + " " + err.code,); }
    });
};