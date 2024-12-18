package dev.reinaldosantos.car_fix.exception;

import java.text.MessageFormat;

public class InternalServerErrorCustom extends RuntimeException {

    private String e;

    public InternalServerErrorCustom(String e) {
        super(MessageFormat.format("Internla server erroer {0}", e));
        this.e = e;
    }

    public String getFieldName() {
        return e;
    }
}
