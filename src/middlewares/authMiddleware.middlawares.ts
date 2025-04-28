import { TokenDataPayload } from "@utils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    tokenData?: TokenDataPayload;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.TOKEN as string);

        if (
            typeof decoded === "object" &&
            "id" in decoded &&
            "identifier" in decoded
        ) {
            req.tokenData = {
                id: decoded.id as string,
                identifier: decoded.identifier as string,
            };
            next();
        } else {
            res.status(401).json({ message: "Invalid token payload" });
        }
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
