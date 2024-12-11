package dev.reinaldosantos.car_fix.ValidatorCustom;

import dev.reinaldosantos.car_fix.customAnnotations.PasswordValidator;
import dev.reinaldosantos.car_fix.utils.ValidPassword;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidatorRules implements ConstraintValidator<PasswordValidator, String> {
    @Override
    public void initialize(PasswordValidator constraintAnnotation) {
    }
    ValidPassword validPassword = new ValidPassword();
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        if (validPassword.isValid(value)) {
            return true;
        }
        return false;
    }
}
