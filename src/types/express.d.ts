// src/types/express.d.ts
import { TokenDataPayload } from "@utils";

declare global {
    namespace Express {
        interface Request {
            tokenData?: TokenDataPayload;
        }
    }
}

