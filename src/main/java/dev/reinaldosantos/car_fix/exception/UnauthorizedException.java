package dev.reinaldosantos.car_fix.exception;

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException() {
        super("Credentials invalid");
    }
}
