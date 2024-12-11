package dev.reinaldosantos.car_fix.ValidatorCustom;

import dev.reinaldosantos.car_fix.customAnnotations.CpfCnpjValidator;
import dev.reinaldosantos.car_fix.utils.ValidCnpj;
import dev.reinaldosantos.car_fix.utils.ValidCpf;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfCnpjValidatorRules implements ConstraintValidator<CpfCnpjValidator, String> {
    @Override
    public void initialize(CpfCnpjValidator constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        String cleanedValue = value.replaceAll("[^0-9]", "");
        if (cleanedValue.matches("(\\d)\\1{10}")) {
            return false;
        }
        if(cleanedValue.length() == 11){
            return ValidCpf.isValid(cleanedValue);
        }else if(cleanedValue.length() == 14){
            return ValidCnpj.isValid(cleanedValue);
        }else {
            return false;
        }
    }
}
