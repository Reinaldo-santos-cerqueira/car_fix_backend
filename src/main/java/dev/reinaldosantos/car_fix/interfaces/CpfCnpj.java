package dev.reinaldosantos.car_fix.interfaces;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import dev.reinaldosantos.car_fix.ValidatorCustom.CpfCnpjValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Constraint(validatedBy = CpfCnpjValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface CpfCnpj {
    String message() default "Please enter valid cpf/cnpj.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
