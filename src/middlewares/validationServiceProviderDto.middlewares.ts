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
            const files = req.files as Express.Multer.File[]; 

            if (errors.length > 0) {
                const formattedErrors: {
                    property: string;
                    messages: string[];
                }[] = errors.map(error => ({
                    property: error.property,
                    messages: Object.values(error.constraints || {})
                }));
                if(!files || files === null){
                    formattedErrors.push({
                        property: "Image document vehicle",
                        messages: ["Image document vehicle is required"]
                    });

                    formattedErrors.push({
                        property: "CNH image",
                        messages: ["CNH image is required"]
                    });
                } else {
                    const hasImageDocumentVehicle = files.some(file => file.fieldname === "imageDocumentVehicle");
                    const hasCnhImage = files.some(file => file.fieldname === "imageCnh");

                    if (!hasImageDocumentVehicle) {
                        formattedErrors.push({
                            property: "Image document vehicle",
                            messages: ["Image document vehicle is required"]
                        });
                    }

                    if (!hasCnhImage) {
                        formattedErrors.push({
                            property: "CNH image",
                            messages: ["CNH image is required"]
                        });
                    }
                }
                

                res.status(400).json({
                    message: "Erro de validação",
                    errors: formattedErrors
                });
                return;
            }else if(!req.files || req.files === null){
                const formattedErrors: {
                    property: string;
                    messages: string[];
                }[] = [];
                formattedErrors.push({
                    property: "Image document vehicle",
                    messages: ["Image document vehicle is required"]
                });
                res.status(400).json({
                    message: "Erro de validação",
                    errors: formattedErrors
                });
                return;
            } else {
                const formattedErrors: {
                    property: string;
                    messages: string[];
                }[] = [];
                const hasImageDocumentVehicle = files.some(file => file.fieldname === "imageDocumentVehicle");
                const hasCnhImage = files.some(file => file.fieldname === "imageCnh");

                if (!hasImageDocumentVehicle) {
                    formattedErrors.push({
                        property: "Image document vehicle",
                        messages: ["Image document vehicle is required"]
                    });
                }

                if (!hasCnhImage) {
                    formattedErrors.push({
                        property: "CNH image",
                        messages: ["CNH image is required"]
                    });
                }
                if (formattedErrors.length > 0) {
                    res.status(400).json({
                        message: "Erro de validação",
                        errors: formattedErrors
                    });
                }

            }

            next();
        };
    }
}