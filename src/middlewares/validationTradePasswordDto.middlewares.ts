import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ChangePasswordDto } from "@dto";

export class ValidationTradePasswordDto {
    static validateUser() {
        return async (req: Request, res: Response, next: NextFunction) => {    
            const dto = plainToInstance(ChangePasswordDto, req.body);

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