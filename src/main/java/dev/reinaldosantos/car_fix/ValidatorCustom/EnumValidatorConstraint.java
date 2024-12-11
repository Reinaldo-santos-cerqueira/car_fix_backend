package dev.reinaldosantos.car_fix.ValidatorCustom;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import dev.reinaldosantos.car_fix.customAnnotations.EnumValidator;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EnumValidatorConstraint implements ConstraintValidator<EnumValidator, CharSequence> {

    private List<String> acceptedValues;

    @Override
    public void initialize(EnumValidator annotation)
    {
        acceptedValues = Stream.of(annotation.enumClass().getEnumConstants())
            .map(Enum::name)
            .collect(Collectors.toList());
    }

    @Override
    public boolean isValid(CharSequence value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        return acceptedValues.contains(value.toString());
    }
}