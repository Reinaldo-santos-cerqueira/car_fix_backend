package dev.reinaldosantos.car_fix.customAnnotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import dev.reinaldosantos.car_fix.ValidatorCustom.CpfCnpjValidatorRules;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Constraint(validatedBy = CpfCnpjValidatorRules.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface CpfCnpjValidator {
    String message() default "Please enter valid cpf/cnpj.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
