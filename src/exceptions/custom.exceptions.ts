export class CustomException extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomException.prototype);
    }
}
