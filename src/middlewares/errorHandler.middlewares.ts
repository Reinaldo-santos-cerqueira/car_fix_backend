import { NextFunction, Request, Response } from "express";
import { CustomException } from "@exceptions";

const Errors = (
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction          
)=> {
    if (error instanceof CustomException) {
        res.status(error.statusCode).json({
            message: error.message,
        });
        return;
    }

    res.status(500).json({
        message: "Internal server error",
    });
};

export { Errors };
