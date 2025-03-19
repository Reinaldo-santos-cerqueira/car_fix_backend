import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ServiceProviderDto } from "@dto";

export class ValidationServiceProviderDtoMiddlewares {
    static validateUser() {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                if (req.body.data) {
                    req.body = JSON.parse(req.body.data);
                }

                const dto = plainToInstance(ServiceProviderDto, req.body);
                const errors = await validate(dto);

                const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat();

                const formattedErrors: { property: string; messages: string[] }[] = [];

                if (errors.length > 0) {
                    formattedErrors.push(...errors.map(error => ({
                        property: error.property,
                        messages: Object.values(error.constraints || {})
                    })));
                }

                if (!files.length) {
                    formattedErrors.push({ property: "Image document vehicle", messages: ["Image document vehicle is required"] });
                    formattedErrors.push({ property: "CNH image", messages: ["CNH image is required"] });
                } else {
                    const hasImageDocumentVehicle = files.some(file => file.fieldname === "imageDocumentVehicle");
                    const hasCnhImage = files.some(file => file.fieldname === "imageCnh");

                    if (!hasImageDocumentVehicle) {
                        formattedErrors.push({ property: "Image document vehicle", messages: ["Image document vehicle is required"] });
                    }
                    if (!hasCnhImage) {
                        formattedErrors.push({ property: "CNH image", messages: ["CNH image is required"] });
                    }
                }

                if (formattedErrors.length > 0) {
                    res.status(400).json({
                        message: "Erro de validação",
                        errors: formattedErrors
                    });
                    return;
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
