package dev.reinaldosantos.car_fix.exception;

import java.text.MessageFormat;

public class NotRegisterFieldException extends RuntimeException {

    private String fieldName;

    public NotRegisterFieldException(String fieldName) {
        super(MessageFormat.format("The {0} not register in database", fieldName));
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
