import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ServiceProviderDto } from "@dto";

export class ValidationServiceProviderDtoMiddlewares {
    static validateUser() {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.body.data) {
                req.body = JSON.parse(req.body.data);
            }

            const dto = plainToInstance(ServiceProviderDto, req.body);
            const errors = await validate(dto);

            let files: Express.Multer.File[] = [];
            const rawFiles = req.files;

            if (rawFiles && typeof rawFiles === "object") {
                files = Object.values(rawFiles).flat();
            }

            const requiredFiles = [
                { fieldname: "imageDocumentVehicle", name: "Image document vehicle" },
                { fieldname: "imageCnh", name: "CNH image" },
                { fieldname: "imageProfile", name: "Profile image" }
            ];

            const missingFiles = requiredFiles.filter(({ fieldname }) => 
                !files.some(file => file.fieldname === fieldname)
            );

            const formattedErrors = errors.map(error => ({
                property: error.property,
                messages: Object.values(error.constraints || {})
            }));

            missingFiles.forEach(({ name }) => {
                formattedErrors.push({
                    property: name,
                    messages: [`${name} is required`]
                });
            });

            if (formattedErrors.length > 0) {
                res.status(400).json({
                    message: "Erro de validação",
                    errors: formattedErrors
                });
                return;
            }

            next();
        };
    }
}
