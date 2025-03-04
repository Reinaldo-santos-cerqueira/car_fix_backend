import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserDto } from "../dto/user.dto";

export class ValidationDtoMiddlewares {
    static validateUser() {
        return async (req: Request, res: Response, next: NextFunction) => {
            // Converte a requisição para o formato do DTO
            const dto = plainToInstance(UserDto, req.body);

            // Valida o DTO
            const errors = await validate(dto);

            if (errors.length > 0) {
                const formattedErrors = errors.map(error => ({
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