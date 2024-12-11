package dev.reinaldosantos.car_fix.dto;

import dev.reinaldosantos.car_fix.customAnnotations.CpfCnpjValidator;
import dev.reinaldosantos.car_fix.customAnnotations.PasswordValidator;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {
    @CpfCnpjValidator
    private String identifier;
    @PasswordValidator
    private String password;
    @NotNull(message = "Please enter token phone")
    private String tokenPhone;

}
