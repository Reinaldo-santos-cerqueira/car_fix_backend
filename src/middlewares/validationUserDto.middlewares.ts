import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserDto } from "../dto/user.dto";

export class ValidationUserDtoMiddlewares {
    static validateUser() {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (req.body.data) {
                req.body = JSON.parse(req.body.data);
            }            
            const dto = plainToInstance(UserDto, req.body);

            const errors = await validate(dto);

            if (errors.length > 0) {
                const formattedErrors: {
                    property: string;
                    messages: string[];
                }[] = errors.map(error => ({
                    property: error.property,
                    messages: Object.values(error.constraints || {})
                }));
                if(!req.file || req.file === null){
                    formattedErrors.push({
                        property: "Image document vehicle",
                        messages: ["Image document vehicle is required"]
                    });
                }

                res.status(400).json({
                    message: "Erro de validação",
                    errors: formattedErrors
                });
                return;
            }else if(!req.file || req.file === null){
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
            }

            next();
        };
    }
}