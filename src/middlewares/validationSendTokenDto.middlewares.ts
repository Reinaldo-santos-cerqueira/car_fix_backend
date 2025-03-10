import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { SendTokenDto } from "@dto";

export class ValidationSendTokenDto {
    static validateUser() {
        return async (req: Request, res: Response, next: NextFunction) => {    
            const dto = plainToInstance(SendTokenDto, req.body);

            const errors = await validate(dto);

            if (errors.length > 0) {
                const formattedErrors: {
                    property: string;
                    messages: string[];
                }[] = errors.map(error => ({
                    property: error.property,
                    messages: Object.values(error.constraints || {})
                }));
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