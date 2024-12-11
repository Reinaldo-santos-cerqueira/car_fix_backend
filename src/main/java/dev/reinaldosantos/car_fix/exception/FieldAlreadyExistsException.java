package dev.reinaldosantos.car_fix.exception;

import java.text.MessageFormat;

public class FieldAlreadyExistsException extends RuntimeException {

    private String fieldName;

    public FieldAlreadyExistsException(String fieldName) {
        super(MessageFormat.format("The {0} already in use", fieldName));
        this.fieldName = fieldName;
    }

    public String getFieldName() {
        return fieldName;
    }
}
